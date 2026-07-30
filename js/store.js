/* Hashcards — persistence and scheduling.
 *
 * Two localStorage keys, nothing else: the deck and the preferences. No
 * cookies, no IndexedDB, no network. Erasing removes both, for good.
 */
(function (global) {
  'use strict';

  var HC = (global.HC = global.HC || {});

  var DECK_KEY = 'hashcards.deck.v1';
  var PREFS_KEY = 'hashcards.prefs.v1';
  var EXPORT_FORMAT = 'hashcards.deck';
  var EXPORT_VERSION = 1;

  // Leitner boxes: how long a card rests after landing in each one.
  var INTERVALS_DAYS = [0, 1, 3, 8, 21, 60];
  var MAX_BOX = INTERVALS_DAYS.length - 1;
  var DAY = 86400000;

  var deck = null;
  var prefs = null;

  function read(key, fallback) {
    try {
      var raw = global.localStorage.getItem(key);
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      global.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function newId() {
    var bytes = new Uint8Array(8);
    global.crypto.getRandomValues(bytes);
    var out = '';
    for (var i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, '0');
    return out;
  }

  function loadDeck() {
    if (!deck) {
      var stored = read(DECK_KEY, null);
      deck = { cards: [] };
      if (stored && Array.isArray(stored.cards)) {
        deck.cards = stored.cards.filter(HC.crypto.validRecord).map(normalise);
      }
    }
    return deck;
  }

  function saveDeck() {
    return write(DECK_KEY, deck);
  }

  /* Fill in anything a hand-edited or older record might be missing. */
  function normalise(card) {
    var box = Number(card.box);
    return {
      id: typeof card.id === 'string' && card.id ? card.id : newId(),
      name: String(card.name == null ? '' : card.name).slice(0, 120),
      hint: String(card.hint == null ? '' : card.hint).slice(0, 200),
      kdf: card.kdf,
      digest: card.digest,
      createdAt: Number(card.createdAt) || Date.now(),
      box: Number.isFinite(box) ? Math.min(Math.max(Math.round(box), 1), MAX_BOX) : 1,
      dueAt: Number(card.dueAt) || 0,
      reviewedAt: Number(card.reviewedAt) || 0,
      correct: Math.max(0, Number(card.correct) || 0),
      wrong: Math.max(0, Number(card.wrong) || 0),
      lastResult: card.lastResult === 'correct' || card.lastResult === 'wrong' ? card.lastResult : null
    };
  }

  function cards() {
    return loadDeck().cards.slice();
  }

  function byId(id) {
    var all = loadDeck().cards;
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }

  function nameTaken(name, exceptId) {
    var needle = String(name).trim().toLowerCase();
    return loadDeck().cards.some(function (c) {
      return c.id !== exceptId && c.name.trim().toLowerCase() === needle;
    });
  }

  /* record is the {kdf, digest} pair from HC.crypto.hash. */
  function addCard(name, hint, record) {
    var card = normalise({
      id: newId(),
      name: name,
      hint: hint,
      kdf: record.kdf,
      digest: record.digest,
      createdAt: Date.now(),
      box: 1,
      dueAt: Date.now()
    });
    loadDeck().cards.push(card);
    saveDeck();
    return card;
  }

  /* record is optional: pass it only when the password itself changed, in
   * which case the card goes back to box 1. */
  function updateCard(id, name, hint, record) {
    var card = byId(id);
    if (!card) return null;
    card.name = String(name).slice(0, 120);
    card.hint = String(hint == null ? '' : hint).slice(0, 200);
    if (record) {
      card.kdf = record.kdf;
      card.digest = record.digest;
      card.box = 1;
      card.dueAt = Date.now();
      card.lastResult = null;
    }
    saveDeck();
    return card;
  }

  function deleteCard(id) {
    var all = loadDeck().cards;
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === id) {
        all.splice(i, 1);
        saveDeck();
        return true;
      }
    }
    return false;
  }

  /* A right answer promotes the card one box, a wrong one sends it back to the
   * first — the classic Leitner rule. */
  function grade(id, wasCorrect) {
    var card = byId(id);
    if (!card) return null;
    var now = Date.now();
    if (wasCorrect) {
      card.box = Math.min(card.box + 1, MAX_BOX);
      card.correct += 1;
      card.lastResult = 'correct';
    } else {
      card.box = 1;
      card.wrong += 1;
      card.lastResult = 'wrong';
    }
    card.reviewedAt = now;
    card.dueAt = now + INTERVALS_DAYS[card.box] * DAY;
    saveDeck();
    return card;
  }

  function dueCards(now) {
    var t = now || Date.now();
    return loadDeck().cards.filter(function (c) {
      return c.dueAt <= t;
    });
  }

  function stats() {
    var all = loadDeck().cards;
    var correct = 0;
    var wrong = 0;
    all.forEach(function (c) {
      correct += c.correct;
      wrong += c.wrong;
    });
    var total = correct + wrong;
    return {
      cards: all.length,
      due: dueCards().length,
      reviews: total,
      accuracy: total ? Math.round((correct / total) * 100) : null
    };
  }

  function shuffle(list) {
    var out = list.slice();
    for (var i = out.length - 1; i > 0; i--) {
      var j = global.crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
      var tmp = out[i];
      out[i] = out[j];
      out[j] = tmp;
    }
    return out;
  }

  /* ---- preferences ---- */

  function loadPrefs() {
    if (!prefs) {
      var stored = read(PREFS_KEY, {});
      prefs = {
        lang: typeof stored.lang === 'string' ? stored.lang : null,
        theme: stored.theme === 'light' || stored.theme === 'dark' ? stored.theme : 'system'
      };
    }
    return prefs;
  }

  function setPref(key, value) {
    loadPrefs()[key] = value;
    write(PREFS_KEY, prefs);
  }

  /* ---- export / import ---- */

  function exportDeck() {
    return {
      format: EXPORT_FORMAT,
      version: EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      cards: loadDeck().cards.map(function (c) {
        return {
          name: c.name,
          hint: c.hint,
          kdf: c.kdf,
          digest: c.digest,
          createdAt: c.createdAt,
          box: c.box,
          dueAt: c.dueAt,
          reviewedAt: c.reviewedAt,
          correct: c.correct,
          wrong: c.wrong,
          lastResult: c.lastResult
        };
      })
    };
  }

  /* mode: 'merge' updates same-named cards and appends the rest,
   *       'replace' drops the current deck first.
   * Returns null when the payload is not a Hashcards export. */
  function importDeck(payload, mode) {
    if (!payload || payload.format !== EXPORT_FORMAT || !Array.isArray(payload.cards)) return null;
    var incoming = payload.cards.filter(HC.crypto.validRecord).map(normalise);
    if (mode === 'replace') {
      deck = { cards: incoming };
      saveDeck();
      return { imported: incoming.length, updated: 0 };
    }
    var current = loadDeck().cards;
    var added = 0;
    var updated = 0;
    incoming.forEach(function (card) {
      var existing = null;
      for (var i = 0; i < current.length; i++) {
        if (current[i].name.trim().toLowerCase() === card.name.trim().toLowerCase()) {
          existing = current[i];
          break;
        }
      }
      if (existing) {
        card.id = existing.id;
        current[current.indexOf(existing)] = card;
        updated += 1;
      } else {
        current.push(card);
        added += 1;
      }
    });
    saveDeck();
    return { imported: added, updated: updated };
  }

  /* The panic button: both keys gone from this browser, in-memory copies too. */
  function eraseAll() {
    try {
      global.localStorage.removeItem(DECK_KEY);
      global.localStorage.removeItem(PREFS_KEY);
    } catch (e) {
      /* nothing left to do */
    }
    deck = { cards: [] };
    prefs = null;
  }

  HC.store = {
    cards: cards,
    byId: byId,
    nameTaken: nameTaken,
    addCard: addCard,
    updateCard: updateCard,
    deleteCard: deleteCard,
    grade: grade,
    dueCards: dueCards,
    stats: stats,
    shuffle: shuffle,
    prefs: loadPrefs,
    setPref: setPref,
    exportDeck: exportDeck,
    importDeck: importDeck,
    eraseAll: eraseAll,
    INTERVALS_DAYS: INTERVALS_DAYS,
    MAX_BOX: MAX_BOX
  };
})(window);
