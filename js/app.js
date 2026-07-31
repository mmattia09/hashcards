/* Hashcards — views, review session and settings.
 *
 * The only place a password exists in this file is the value of an <input>,
 * for as long as it takes to hash it. It is cleared immediately afterwards and
 * never assigned to a variable that outlives the check.
 */
(function (global) {
  'use strict';

  var HC = global.HC;
  var doc = global.document;
  var t = HC.i18n.t;

  var VERSION = '1.0.0';
  var DAY = 86400000;

  var $ = function (id) {
    return doc.getElementById(id);
  };

  var view = 'home';
  var session = null;
  var pendingDeleteId = null;
  var editingId = null;

  /* ------------------------------------------------------------ helpers */

  function show(el, visible) {
    if (el) el.hidden = !visible;
  }

  function text(el, value) {
    if (el) el.textContent = value;
  }

  function on(el, event, handler) {
    if (el) el.addEventListener(event, handler);
  }

  function toast(message) {
    var node = doc.createElement('div');
    node.className = 'toast';
    node.textContent = message;
    $('toast-area').appendChild(node);
    global.setTimeout(function () {
      node.classList.add('leaving');
      global.setTimeout(function () {
        node.remove();
      }, 250);
    }, 2400);
  }

  /* ------------------------------------------------------------- theme */

  var mediaDark = global.matchMedia ? global.matchMedia('(prefers-color-scheme: dark)') : null;

  function effectiveTheme() {
    var choice = HC.store.prefs().theme;
    if (choice === 'light' || choice === 'dark') return choice;
    return mediaDark && mediaDark.matches ? 'dark' : 'light';
  }

  function applyTheme() {
    doc.documentElement.setAttribute('data-theme', effectiveTheme());
    var buttons = $('seg-theme').querySelectorAll('button');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute(
        'aria-pressed',
        buttons[i].getAttribute('data-theme') === HC.store.prefs().theme ? 'true' : 'false'
      );
    }
  }

  /* --------------------------------------------------------------- i18n */

  function applyStrings(root) {
    var scope = root || doc;
    var i;
    var nodes = scope.querySelectorAll('[data-i18n]');
    for (i = 0; i < nodes.length; i++) nodes[i].textContent = t(nodes[i].getAttribute('data-i18n'));

    nodes = scope.querySelectorAll('[data-i18n-placeholder]');
    for (i = 0; i < nodes.length; i++) {
      nodes[i].setAttribute('placeholder', t(nodes[i].getAttribute('data-i18n-placeholder')));
    }
    nodes = scope.querySelectorAll('[data-i18n-title]');
    for (i = 0; i < nodes.length; i++) {
      nodes[i].setAttribute('title', t(nodes[i].getAttribute('data-i18n-title')));
    }
    nodes = scope.querySelectorAll('[data-i18n-aria]');
    for (i = 0; i < nodes.length; i++) {
      nodes[i].setAttribute('aria-label', t(nodes[i].getAttribute('data-i18n-aria')));
    }

    text($('how-body'), t('settings.howBody', {
      iterations: HC.crypto.ITERATIONS.toLocaleString(HC.i18n.lang())
    }));
    text($('about-body'), t('settings.aboutBody', { version: VERSION }));
  }

  function retranslate() {
    applyStrings();
    renderHome();
    if (view === 'study') renderCard();
    if (view === 'done') renderDone();
  }

  /* ------------------------------------------------------------ routing */

  function go(next) {
    view = next;
    show($('view-home'), next === 'home');
    show($('view-study'), next === 'study');
    show($('view-done'), next === 'done');
    show($('view-settings'), next === 'settings');
    global.scrollTo(0, 0);
  }

  /* --------------------------------------------------------------- home */

  function dueLabel(card) {
    var now = Date.now();
    if (card.dueAt <= now) return t('card.dueNow');
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var days = Math.ceil((card.dueAt - today.getTime()) / DAY);
    if (days <= 1) return t('card.dueToday');
    if (days === 2) return t('card.dueTomorrow');
    return t('card.dueInDays', { n: days - 1 });
  }

  /* The box lives in the pip, so the line below the name only carries the two
   * things that change: when it is next up, and how it has gone so far. */
  function cardMeta(card) {
    var reviewed = card.correct + card.wrong > 0;
    return [
      dueLabel(card),
      reviewed ? t('card.score', { correct: card.correct, wrong: card.wrong }) : t('card.never')
    ];
  }

  function metaNode(parts) {
    var meta = doc.createElement('span');
    meta.className = 'card-meta';
    parts.forEach(function (part, index) {
      if (index) {
        var dot = doc.createElement('span');
        dot.className = 'dot';
        dot.textContent = '·';
        meta.appendChild(dot);
      }
      meta.appendChild(doc.createTextNode(part));
    });
    return meta;
  }

  function iconButton(icon, label, handler) {
    var button = doc.createElement('button');
    button.type = 'button';
    button.className = 'icon-btn';
    button.innerHTML = HC.icons.svg(icon);
    button.title = label;
    button.setAttribute('aria-label', label);
    button.addEventListener('click', handler);
    return button;
  }

  /* A deck row: the left-hand side is one wide button that reviews this card on
   * its own, with edit and delete alongside. */
  function cardRow(card) {
    var row = doc.createElement('li');
    row.className = 'card-row';
    if (card.dueAt <= Date.now()) row.classList.add('is-due');

    var open = doc.createElement('button');
    open.type = 'button';
    open.className = 'card-open';
    open.title = t('card.review');
    open.setAttribute('aria-label', t('card.review') + ' — ' + card.name);
    open.addEventListener('click', function () {
      startSession([card]);
    });

    var pip = doc.createElement('span');
    pip.className = 'box-pip';
    pip.textContent = card.box;
    pip.title = t('card.box', { n: card.box });
    open.appendChild(pip);

    var main = doc.createElement('span');
    main.className = 'card-main';
    var name = doc.createElement('span');
    name.className = 'card-name';
    name.textContent = card.name;
    main.appendChild(name);
    main.appendChild(metaNode(cardMeta(card)));
    open.appendChild(main);
    row.appendChild(open);

    var actions = doc.createElement('div');
    actions.className = 'card-actions';
    actions.appendChild(
      iconButton('pencil', t('card.edit'), function () {
        openCardDialog(card.id);
      })
    );
    actions.appendChild(
      iconButton('trash', t('card.delete'), function () {
        askDelete(card.id);
      })
    );
    row.appendChild(actions);
    return row;
  }

  function renderHome() {
    var stats = HC.store.stats();
    text($('stat-cards'), stats.cards);
    text($('stat-due'), stats.due);
    text($('stat-accuracy'), stats.accuracy == null ? '—' : stats.accuracy + '%');
    $('stats').children[1].classList.toggle('is-due', stats.due > 0);

    var hasCards = stats.cards > 0;
    show($('start-block'), hasCards);
    show($('empty'), !hasCards);
    show($('card-list'), hasCards);
    show($('cards-head'), hasCards);

    text(
      $('btn-start'),
      stats.due === 1 ? t('home.startDueOne') : t('home.startDue', { n: stats.due })
    );
    show($('btn-start'), stats.due > 0);
    show($('caught-up'), hasCards && stats.due === 0);
    show($('btn-start-all'), hasCards);

    var list = $('card-list');
    list.textContent = '';
    HC.store
      .cards()
      .slice()
      .sort(function (a, b) {
        return a.dueAt - b.dueAt || a.createdAt - b.createdAt;
      })
      .forEach(function (card) {
        list.appendChild(cardRow(card));
      });
  }

  /* -------------------------------------------------------------- study */

  function startSession(cards) {
    if (!cards.length) return;
    session = {
      ids: cards.map(function (c) {
        return c.id;
      }),
      queue: HC.store.shuffle(cards).map(function (c) {
        return c.id;
      }),
      index: 0,
      correct: 0,
      failed: false,
      busy: false
    };
    go('study');
    renderCard();
  }

  function currentCard() {
    return session ? HC.store.byId(session.queue[session.index]) : null;
  }

  function renderCard() {
    var card = currentCard();
    if (!card) return finishSession();

    session.failed = false;
    session.busy = false;

    text($('study-name'), card.name);
    text($('progress-label'), t('study.progress', { i: session.index + 1, n: session.queue.length }));
    $('progress-fill').style.width = (session.index / session.queue.length) * 100 + '%';

    show($('hint-area'), !!card.hint);
    show($('hint-text'), false);
    show($('btn-hint'), true);
    text($('hint-text'), card.hint);

    var input = $('study-input');
    input.value = '';
    input.type = 'password';
    input.disabled = false;
    setRevealIcon($('btn-reveal'), false);

    $('flashcard').classList.remove('is-correct', 'is-wrong');
    show($('feedback'), false);
    show($('btn-check'), true);
    $('btn-check').disabled = false;
    text($('btn-check'), t('study.check'));
    show($('btn-skip'), true);
    show($('btn-next'), false);

    if (!('ontouchstart' in global)) input.focus();
  }

  function feedback(ok, title, help) {
    var box = $('feedback');
    box.className = 'feedback ' + (ok ? 'ok' : 'no');
    box.querySelector('.feedback-mark').innerHTML = HC.icons.svg(ok ? 'check' : 'cross');
    text($('feedback-title'), title);
    text($('feedback-help'), help || '');
    show($('feedback-help'), !!help);
    show(box, true);
    $('flashcard').classList.toggle('is-correct', ok);
    $('flashcard').classList.toggle('is-wrong', !ok);
  }

  function checkAnswer(event) {
    if (event) event.preventDefault();
    if (!session || session.busy) return;
    var card = currentCard();
    var input = $('study-input');
    if (!card || !input.value) return;

    session.busy = true;
    $('btn-check').disabled = true;
    text($('btn-check'), t('study.checking'));

    HC.crypto
      .verify(input.value, card)
      .then(function (matches) {
        input.value = '';
        session.busy = false;

        if (matches) {
          if (!session.failed) session.correct += 1;
          HC.store.grade(card.id, !session.failed);
          input.disabled = true;
          show($('btn-check'), false);
          show($('btn-skip'), false);
          show($('btn-next'), true);
          text(
            $('btn-next'),
            session.index + 1 < session.queue.length ? t('study.next') : t('study.done.title')
          );
          feedback(true, t('study.correct'));
          $('btn-next').focus();
        } else {
          session.failed = true;
          $('btn-check').disabled = false;
          text($('btn-check'), t('study.retry'));
          feedback(false, t('study.wrong'), t('study.wrongHelp'));
          $('flashcard').classList.add('shake');
          global.setTimeout(function () {
            $('flashcard').classList.remove('shake');
          }, 420);
          input.focus();
        }
      })
      .catch(function () {
        session.busy = false;
        input.value = '';
        $('btn-check').disabled = false;
        text($('btn-check'), t('study.check'));
      });
  }

  function skipCard() {
    var card = currentCard();
    if (!card) return;
    HC.store.grade(card.id, false);
    advance();
  }

  function advance() {
    session.index += 1;
    if (session.index >= session.queue.length) finishSession();
    else renderCard();
  }

  function finishSession() {
    $('study-input').value = '';
    renderDone();
    go('done');
    renderHome();
  }

  function renderDone() {
    if (!session) return;
    var total = session.queue.length;
    var line = t('study.done.score', { correct: session.correct, total: total });
    text($('done-score'), (session.correct === total ? t('study.done.perfect') : '') + line);
  }

  function quitSession() {
    $('study-input').value = '';
    session = null;
    renderHome();
    go('home');
  }

  function setRevealIcon(button, revealed) {
    button.innerHTML = HC.icons.svg(revealed ? 'eye-off' : 'eye');
    var label = t(revealed ? 'study.hide' : 'study.reveal');
    button.title = label;
    button.setAttribute('aria-label', label);
  }

  function bindReveal(buttonId, inputId) {
    on($(buttonId), 'click', function () {
      var input = $(inputId);
      var revealed = input.type === 'text';
      input.type = revealed ? 'password' : 'text';
      setRevealIcon($(buttonId), !revealed);
      input.focus();
    });
  }

  /* ------------------------------------------------------- card dialog */

  function openCardDialog(id) {
    editingId = id || null;
    var card = id ? HC.store.byId(id) : null;

    text($('dlg-card-title'), t(card ? 'dialog.editCard' : 'dialog.newCard'));
    $('fld-name').value = card ? card.name : '';
    $('fld-hint').value = card ? card.hint : '';
    $('fld-pw').value = '';
    $('fld-pw2').value = '';
    $('fld-pw').type = 'password';
    setRevealIcon($('btn-reveal-new'), false);
    show($('card-error'), false);

    show($('password-choice'), !!card);
    var keep = doc.querySelector('input[name="pwmode"][value="keep"]');
    keep.checked = true;
    show($('password-fields'), !card);

    $('btn-card-save').disabled = false;
    text($('btn-card-save'), t('dialog.save'));
    $('dlg-card').showModal();
    $('fld-name').focus();
  }

  function passwordMode() {
    var checked = doc.querySelector('input[name="pwmode"]:checked');
    return editingId && checked ? checked.value : 'change';
  }

  function cardError(key) {
    text($('card-error'), t(key));
    show($('card-error'), true);
  }

  function saveCard(event) {
    event.preventDefault();

    var name = $('fld-name').value.trim();
    var hint = $('fld-hint').value.trim();
    var mode = passwordMode();
    var pw = $('fld-pw');
    var pw2 = $('fld-pw2');

    show($('card-error'), false);

    if (!name) return cardError('error.nameRequired');
    if (HC.store.nameTaken(name, editingId)) return cardError('error.nameTaken');

    if (mode === 'keep') {
      HC.store.updateCard(editingId, name, hint, null);
      closeCardDialog();
      toast(t('toast.cardUpdated'));
      return;
    }

    if (!pw.value) return cardError('error.passwordRequired');
    if (pw.value !== pw2.value) return cardError('error.passwordMismatch');

    $('btn-card-save').disabled = true;
    text($('btn-card-save'), t('dialog.hashing'));

    HC.crypto
      .hash(pw.value)
      .then(function (record) {
        pw.value = '';
        pw2.value = '';
        if (editingId) HC.store.updateCard(editingId, name, hint, record);
        else HC.store.addCard(name, hint, record);
        var wasEdit = !!editingId;
        closeCardDialog();
        toast(t(wasEdit ? 'toast.cardUpdated' : 'toast.cardAdded'));
      })
      .catch(function () {
        pw.value = '';
        pw2.value = '';
        $('btn-card-save').disabled = false;
        text($('btn-card-save'), t('dialog.save'));
        cardError('error.storageFull');
      });
  }

  function closeCardDialog() {
    $('fld-pw').value = '';
    $('fld-pw2').value = '';
    editingId = null;
    $('dlg-card').close();
    renderHome();
  }

  /* ------------------------------------------------------ delete dialog */

  function askDelete(id) {
    var card = HC.store.byId(id);
    if (!card) return;
    pendingDeleteId = id;
    text($('delete-body'), t('dialog.delete.body', { name: card.name }));
    $('dlg-delete').showModal();
  }

  /* ------------------------------------------------------------- export */

  function exportDeck() {
    var payload = JSON.stringify(HC.store.exportDeck(), null, 2);
    var blob = new global.Blob([payload], { type: 'application/json' });
    var url = global.URL.createObjectURL(blob);
    var link = doc.createElement('a');
    var stamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = 'hashcards-' + stamp + '.json';
    doc.body.appendChild(link);
    link.click();
    link.remove();
    global.setTimeout(function () {
      global.URL.revokeObjectURL(url);
    }, 1000);
    toast(t('toast.exported'));
  }

  /* ------------------------------------------------------------- import */

  function openImportDialog() {
    $('import-file').value = '';
    $('import-text').value = '';
    doc.querySelector('input[name="importmode"][value="merge"]').checked = true;
    show($('import-error'), false);
    $('dlg-import').showModal();
  }

  function importError(key) {
    text($('import-error'), t(key));
    show($('import-error'), true);
  }

  function readImportPayload() {
    var file = $('import-file').files[0];
    if (file) return file.text();
    var pasted = $('import-text').value.trim();
    return pasted ? Promise.resolve(pasted) : Promise.resolve(null);
  }

  function runImport(event) {
    event.preventDefault();
    show($('import-error'), false);

    readImportPayload().then(function (raw) {
      if (!raw) return importError('error.importEmpty');

      var payload;
      try {
        payload = JSON.parse(raw);
      } catch (e) {
        return importError('error.importInvalid');
      }

      var mode = doc.querySelector('input[name="importmode"]:checked').value;
      var result = HC.store.importDeck(payload, mode);
      if (!result) return importError('error.importInvalid');

      $('dlg-import').close();
      renderHome();
      toast(t('toast.imported', { added: result.imported, updated: result.updated }));
    });
  }

  /* -------------------------------------------------------------- erase */

  function openEraseDialog() {
    $('erase-ack').checked = false;
    $('btn-erase-confirm').disabled = true;
    $('dlg-erase').showModal();
  }

  function eraseEverything() {
    HC.store.eraseAll();
    session = null;
    // Deliberately not written back: erasing should leave no key of ours in
    // this browser at all. Preferences persist again on the next change.
    HC.i18n.setLang(HC.i18n.detect());
    applyTheme();
    retranslate();
    syncSettingsControls();
    go('home');
    toast(t('toast.erased'));
  }

  /* ----------------------------------------------------------- settings */

  function syncSettingsControls() {
    var select = $('sel-lang');
    select.textContent = '';
    HC.i18n.LANGUAGES.forEach(function (entry) {
      var option = doc.createElement('option');
      option.value = entry.code;
      option.textContent = entry.label;
      select.appendChild(option);
    });
    select.value = HC.i18n.lang();
    applyTheme();
  }

  /* --------------------------------------------------------------- boot */

  function bind() {
    on($('link-home'), 'click', function (e) {
      e.preventDefault();
      if (view === 'study') return;
      renderHome();
      go('home');
    });
    on($('btn-settings'), 'click', function () {
      syncSettingsControls();
      go('settings');
    });
    on($('btn-back'), 'click', function () {
      renderHome();
      go('home');
    });

    on($('btn-theme'), 'click', function () {
      HC.store.setPref('theme', effectiveTheme() === 'dark' ? 'light' : 'dark');
      applyTheme();
    });
    on($('seg-theme'), 'click', function (e) {
      var button = e.target.closest('button[data-theme]');
      if (!button) return;
      HC.store.setPref('theme', button.getAttribute('data-theme'));
      applyTheme();
    });
    if (mediaDark && mediaDark.addEventListener) {
      mediaDark.addEventListener('change', function () {
        if (HC.store.prefs().theme === 'system') applyTheme();
      });
    }

    on($('sel-lang'), 'change', function (e) {
      HC.i18n.setLang(e.target.value);
      HC.store.setPref('lang', HC.i18n.lang());
      retranslate();
    });

    on($('btn-start'), 'click', function () {
      startSession(HC.store.dueCards());
    });
    on($('btn-start-all'), 'click', function () {
      startSession(HC.store.cards());
    });

    on($('btn-add'), 'click', function () {
      openCardDialog(null);
    });
    on($('btn-empty-add'), 'click', function () {
      openCardDialog(null);
    });

    on($('study-form'), 'submit', checkAnswer);
    // Implicit submission is unreliable once the submit button is hidden, and
    // Enter is the natural way to answer a flashcard.
    on($('study-input'), 'keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        checkAnswer();
      }
    });
    on($('btn-skip'), 'click', skipCard);
    on($('btn-next'), 'click', advance);
    on($('btn-quit'), 'click', quitSession);
    on($('btn-hint'), 'click', function () {
      show($('hint-text'), true);
      show($('btn-hint'), false);
      $('study-input').focus();
    });
    bindReveal('btn-reveal', 'study-input');
    bindReveal('btn-reveal-new', 'fld-pw');

    on($('btn-again'), 'click', function () {
      if (!session) return go('home');
      var cards = session.ids
        .map(function (id) {
          return HC.store.byId(id);
        })
        .filter(Boolean);
      startSession(cards);
    });
    on($('btn-done-home'), 'click', function () {
      session = null;
      renderHome();
      go('home');
    });

    on($('form-card'), 'submit', saveCard);
    on($('dlg-card'), 'close', function () {
      $('fld-pw').value = '';
      $('fld-pw2').value = '';
    });
    doc.querySelectorAll('input[name="pwmode"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        show($('password-fields'), radio.value === 'change' && radio.checked);
        if (radio.value === 'change' && radio.checked) $('fld-pw').focus();
      });
    });

    on($('dlg-delete').querySelector('form'), 'submit', function () {
      if (pendingDeleteId) {
        HC.store.deleteCard(pendingDeleteId);
        pendingDeleteId = null;
        renderHome();
        toast(t('toast.cardDeleted'));
      }
    });

    on($('btn-export'), 'click', exportDeck);
    on($('btn-import'), 'click', openImportDialog);
    on($('dlg-import').querySelector('form'), 'submit', runImport);

    on($('btn-erase'), 'click', openEraseDialog);
    on($('erase-ack'), 'change', function (e) {
      $('btn-erase-confirm').disabled = !e.target.checked;
    });
    on($('dlg-erase').querySelector('form'), 'submit', function () {
      eraseEverything();
    });

    doc.querySelectorAll('[data-close]').forEach(function (button) {
      button.addEventListener('click', function () {
        button.closest('dialog').close();
      });
    });

    global.addEventListener('scroll', function () {
      doc.querySelector('.topbar').classList.toggle('scrolled', global.scrollY > 4);
    }, { passive: true });
  }

  function boot() {
    HC.icons.paint();

    if (!HC.crypto.supported()) {
      HC.i18n.setLang(HC.i18n.detect());
      applyStrings($('unsupported'));
      show($('unsupported'), true);
      return;
    }

    var prefs = HC.store.prefs();
    HC.i18n.setLang(prefs.lang || HC.i18n.detect());
    if (!prefs.lang) HC.store.setPref('lang', HC.i18n.lang());

    applyTheme();
    bind();
    syncSettingsControls();
    applyStrings();
    renderHome();
    show($('app'), true);

    if ('serviceWorker' in global.navigator && global.location.protocol.indexOf('http') === 0) {
      global.navigator.serviceWorker.register('sw.js').catch(function () {
        /* offline support is a bonus, not a requirement */
      });
    }
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
