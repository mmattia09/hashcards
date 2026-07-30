/* Hashcards — interface strings.
 *
 * English is the source of truth; the other dictionaries are typed against it
 * by `HC.i18n.missing()`, which lists any key a translation forgot. Strings may
 * contain {placeholders}, filled in by the second argument of t().
 */
(function (global) {
  'use strict';

  var HC = (global.HC = global.HC || {});

  var DICTS = {};

  DICTS.en = {
    'app.tagline': 'Practise your passwords. Never store them.',

    'nav.settings': 'Settings',
    'nav.back': 'Back',
    'nav.theme': 'Switch theme',
    'nav.language': 'Language',

    'home.cards': 'Cards',
    'home.due': 'Due now',
    'home.accuracy': 'Accuracy',
    'home.start': 'Start review',
    'home.startDue': 'Review {n} due',
    'home.startAll': 'Review every card',
    'home.caughtUp': 'Nothing is due right now — come back later, or run through the whole deck anyway.',
    'home.list': 'Your cards',
    'home.add': 'Add card',
    'home.empty.title': 'No cards yet',
    'home.empty.body':
      'Add an account and the password you want to be able to recall. Hashcards keeps only a salted hash of it, so the password itself is never written to disk — not even once.',
    'home.empty.cta': 'Add your first card',

    'card.dueNow': 'Due now',
    'card.dueToday': 'Due today',
    'card.dueTomorrow': 'Due tomorrow',
    'card.dueInDays': 'Due in {n} days',
    'card.box': 'Box {n}',
    'card.never': 'Never reviewed',
    'card.score': '{correct} right · {wrong} wrong',
    'card.edit': 'Edit',
    'card.delete': 'Delete',

    'study.progress': '{i} of {n}',
    'study.question': 'What is the password for',
    'study.placeholder': 'Type the password',
    'study.check': 'Check',
    'study.checking': 'Checking…',
    'study.skip': 'Skip',
    'study.next': 'Next',
    'study.retry': 'Try again',
    'study.correct': 'That is a match',
    'study.wrong': 'Not a match',
    'study.wrongHelp':
      'Nothing can be revealed: the password is not stored anywhere, only its hash.',
    'study.skipped': 'Skipped — counted as missed.',
    'study.hintShow': 'Show hint',
    'study.hint': 'Hint',
    'study.reveal': 'Show what I am typing',
    'study.hide': 'Hide what I am typing',
    'study.quit': 'End session',
    'study.done.title': 'Session complete',
    'study.done.score': '{correct} of {total} recalled',
    'study.done.perfect': 'Every single one. ',
    'study.done.again': 'Go again',
    'study.done.home': 'Back to deck',

    'settings.title': 'Settings',
    'settings.appearance': 'Appearance',
    'settings.theme': 'Theme',
    'settings.themeSystem': 'System',
    'settings.themeLight': 'Light',
    'settings.themeDark': 'Dark',
    'settings.language': 'Language',
    'settings.cards': 'Cards',
    'settings.cardsHelp': 'Add, rename or remove the accounts you are practising.',
    'settings.data': 'Data',
    'settings.export': 'Export deck',
    'settings.exportHelp':
      'Downloads a JSON file with your hashes, salts and progress — no passwords. Keep it private anyway: a hash can be attacked offline.',
    'settings.import': 'Import deck',
    'settings.importHelp': 'Load a file exported by Hashcards, on this device or another.',
    'settings.erase': 'Erase everything',
    'settings.eraseHelp':
      'Wipes every card and all progress from this browser, permanently. Nothing is sent anywhere, so nothing can be recovered.',
    'settings.how': 'How it works',
    'settings.howBody':
      'When you add a card, the password is hashed with PBKDF2-HMAC-SHA-256 — {iterations} iterations and a fresh 16-byte random salt — and only the result is saved. Checking an answer hashes what you typed with the same salt and compares the two digests byte by byte, in constant time. There is no server, no account and no telemetry: everything happens in this browser, and everything lives in its local storage.',
    'settings.about': 'About',
    'settings.aboutBody': 'Version {version} · open source, MIT licensed.',
    'settings.source': 'Source code',

    'dialog.newCard': 'New card',
    'dialog.editCard': 'Edit card',
    'dialog.name': 'Account',
    'dialog.namePlaceholder': 'e.g. Email — personal',
    'dialog.hint': 'Hint',
    'dialog.hintOptional': 'optional',
    'dialog.hintPlaceholder': 'Shown on request during a review',
    'dialog.hintHelp': 'Saved as written, in clear. Never put the password in here.',
    'dialog.password': 'Password',
    'dialog.passwordRepeat': 'Repeat password',
    'dialog.passwordHelp': 'Hashed the moment you save. It is not kept, and cannot be shown again.',
    'dialog.keepPassword': 'Keep the current password',
    'dialog.changePassword': 'Replace the password',
    'dialog.changePasswordHelp': 'The card goes back to the first box.',
    'dialog.save': 'Save',
    'dialog.cancel': 'Cancel',
    'dialog.hashing': 'Hashing…',

    'dialog.delete.title': 'Delete card',
    'dialog.delete.body': 'Remove “{name}” from this browser? Its hash and progress go with it.',
    'dialog.delete.confirm': 'Delete card',

    'dialog.erase.title': 'Erase everything',
    'dialog.erase.body':
      'Every card, every hash and all of your progress will be removed from this browser. Files you exported earlier are not affected.',
    'dialog.erase.ack': 'I understand this cannot be undone.',
    'dialog.erase.confirm': 'Erase everything',

    'dialog.import.title': 'Import deck',
    'dialog.import.file': 'Choose a file',
    'dialog.import.or': 'or paste the JSON',
    'dialog.import.pastePlaceholder': 'Paste the contents of a Hashcards export…',
    'dialog.import.mode': 'Cards already in the deck',
    'dialog.import.merge': 'Update those with the same name, add the rest',
    'dialog.import.replace': 'Replace the whole deck',
    'dialog.import.confirm': 'Import',

    'error.nameRequired': 'Give the card a name.',
    'error.nameTaken': 'There is already a card with this name.',
    'error.passwordRequired': 'Type the password you want to practise.',
    'error.passwordMismatch': 'The two entries do not match.',
    'error.importInvalid': 'This is not a Hashcards export.',
    'error.importEmpty': 'Choose a file or paste the JSON first.',
    'error.storageFull': 'This browser refused to save. Its storage may be full or blocked.',

    'toast.cardAdded': 'Card added',
    'toast.cardUpdated': 'Card updated',
    'toast.cardDeleted': 'Card deleted',
    'toast.exported': 'Deck exported',
    'toast.imported': '{added} added, {updated} updated',
    'toast.erased': 'Everything erased',

    'unsupported.title': 'This browser cannot run Hashcards',
    'unsupported.body':
      'Hashcards needs the Web Crypto API to hash passwords, and it is not available here. Open the app over https:// (or on localhost) in an up-to-date browser.'
  };

  DICTS.it = {
    'app.tagline': 'Allena le tue password. Nessuna viene salvata.',

    'nav.settings': 'Impostazioni',
    'nav.back': 'Indietro',
    'nav.theme': 'Cambia tema',
    'nav.language': 'Lingua',

    'home.cards': 'Carte',
    'home.due': 'Da ripassare',
    'home.accuracy': 'Precisione',
    'home.start': 'Inizia il ripasso',
    'home.startDue': 'Ripassa le {n} in scadenza',
    'home.startAll': 'Ripassa tutte le carte',
    'home.caughtUp': 'Per ora non c’è niente da ripassare: torna più tardi, oppure rivedi comunque tutto il mazzo.',
    'home.list': 'Le tue carte',
    'home.add': 'Aggiungi carta',
    'home.empty.title': 'Nessuna carta',
    'home.empty.body':
      'Aggiungi un account e la password che vuoi riuscire a ricordare. Hashcards ne conserva solo un hash con sale, quindi la password non viene mai scritta su disco: nemmeno una volta.',
    'home.empty.cta': 'Aggiungi la prima carta',

    'card.dueNow': 'Da ripassare',
    'card.dueToday': 'Da ripassare oggi',
    'card.dueTomorrow': 'Da ripassare domani',
    'card.dueInDays': 'Tra {n} giorni',
    'card.box': 'Scatola {n}',
    'card.never': 'Mai ripassata',
    'card.score': '{correct} giuste · {wrong} sbagliate',
    'card.edit': 'Modifica',
    'card.delete': 'Elimina',

    'study.progress': '{i} di {n}',
    'study.question': 'Qual è la password di',
    'study.placeholder': 'Scrivi la password',
    'study.check': 'Verifica',
    'study.checking': 'Verifico…',
    'study.skip': 'Salta',
    'study.next': 'Avanti',
    'study.retry': 'Riprova',
    'study.correct': 'Corrisponde',
    'study.wrong': 'Non corrisponde',
    'study.wrongHelp':
      'Non si può rivelare nulla: la password non è salvata da nessuna parte, solo il suo hash.',
    'study.skipped': 'Saltata: conta come sbagliata.',
    'study.hintShow': 'Mostra l’indizio',
    'study.hint': 'Indizio',
    'study.reveal': 'Mostra quello che sto scrivendo',
    'study.hide': 'Nascondi quello che sto scrivendo',
    'study.quit': 'Chiudi la sessione',
    'study.done.title': 'Sessione conclusa',
    'study.done.score': '{correct} ricordate su {total}',
    'study.done.perfect': 'Tutte quante. ',
    'study.done.again': 'Ancora',
    'study.done.home': 'Torna al mazzo',

    'settings.title': 'Impostazioni',
    'settings.appearance': 'Aspetto',
    'settings.theme': 'Tema',
    'settings.themeSystem': 'Sistema',
    'settings.themeLight': 'Chiaro',
    'settings.themeDark': 'Scuro',
    'settings.language': 'Lingua',
    'settings.cards': 'Carte',
    'settings.cardsHelp': 'Aggiungi, rinomina o elimina gli account su cui ti stai allenando.',
    'settings.data': 'Dati',
    'settings.export': 'Esporta il mazzo',
    'settings.exportHelp':
      'Scarica un file JSON con hash, sali e progressi: nessuna password. Tienilo comunque privato, perché un hash si può attaccare offline.',
    'settings.import': 'Importa un mazzo',
    'settings.importHelp': 'Carica un file esportato da Hashcards, da questo o da un altro dispositivo.',
    'settings.erase': 'Cancella tutto',
    'settings.eraseHelp':
      'Elimina definitivamente da questo browser tutte le carte e i progressi. Non essendo mai stati inviati altrove, non si possono recuperare.',
    'settings.how': 'Come funziona',
    'settings.howBody':
      'Quando aggiungi una carta, la password passa per PBKDF2-HMAC-SHA-256 — {iterations} iterazioni e un sale casuale di 16 byte, diverso per ogni carta — e viene salvato solo il risultato. Per verificare una risposta si ricalcola l’hash di quello che hai scritto con lo stesso sale e si confrontano i due digest byte per byte, a tempo costante. Non c’è nessun server, nessun account e nessuna telemetria: tutto avviene in questo browser e resta nella sua memoria locale.',
    'settings.about': 'Informazioni',
    'settings.aboutBody': 'Versione {version} · codice aperto, licenza MIT.',
    'settings.source': 'Codice sorgente',

    'dialog.newCard': 'Nuova carta',
    'dialog.editCard': 'Modifica carta',
    'dialog.name': 'Account',
    'dialog.namePlaceholder': 'es. Email — personale',
    'dialog.hint': 'Indizio',
    'dialog.hintOptional': 'facoltativo',
    'dialog.hintPlaceholder': 'Mostrato su richiesta durante il ripasso',
    'dialog.hintHelp': 'Salvato così com’è, in chiaro. Non scriverci dentro la password.',
    'dialog.password': 'Password',
    'dialog.passwordRepeat': 'Ripeti la password',
    'dialog.passwordHelp': 'Viene trasformata in hash appena salvi. Non resta da nessuna parte e non si può più rivedere.',
    'dialog.keepPassword': 'Mantieni la password attuale',
    'dialog.changePassword': 'Sostituisci la password',
    'dialog.changePasswordHelp': 'La carta torna nella prima scatola.',
    'dialog.save': 'Salva',
    'dialog.cancel': 'Annulla',
    'dialog.hashing': 'Calcolo l’hash…',

    'dialog.delete.title': 'Elimina la carta',
    'dialog.delete.body': 'Vuoi togliere “{name}” da questo browser? Se ne vanno anche il suo hash e i progressi.',
    'dialog.delete.confirm': 'Elimina la carta',

    'dialog.erase.title': 'Cancella tutto',
    'dialog.erase.body':
      'Ogni carta, ogni hash e tutti i tuoi progressi verranno rimossi da questo browser. I file che hai esportato prima non vengono toccati.',
    'dialog.erase.ack': 'Ho capito che non si può tornare indietro.',
    'dialog.erase.confirm': 'Cancella tutto',

    'dialog.import.title': 'Importa un mazzo',
    'dialog.import.file': 'Scegli un file',
    'dialog.import.or': 'oppure incolla il JSON',
    'dialog.import.pastePlaceholder': 'Incolla qui il contenuto di un export di Hashcards…',
    'dialog.import.mode': 'Carte già presenti nel mazzo',
    'dialog.import.merge': 'Aggiorna quelle con lo stesso nome, aggiungi le altre',
    'dialog.import.replace': 'Sostituisci tutto il mazzo',
    'dialog.import.confirm': 'Importa',

    'error.nameRequired': 'Dai un nome alla carta.',
    'error.nameTaken': 'Esiste già una carta con questo nome.',
    'error.passwordRequired': 'Scrivi la password su cui vuoi allenarti.',
    'error.passwordMismatch': 'Le due password non coincidono.',
    'error.importInvalid': 'Questo non è un export di Hashcards.',
    'error.importEmpty': 'Prima scegli un file o incolla il JSON.',
    'error.storageFull': 'Il browser si è rifiutato di salvare. La memoria potrebbe essere piena o bloccata.',

    'toast.cardAdded': 'Carta aggiunta',
    'toast.cardUpdated': 'Carta aggiornata',
    'toast.cardDeleted': 'Carta eliminata',
    'toast.exported': 'Mazzo esportato',
    'toast.imported': '{added} aggiunte, {updated} aggiornate',
    'toast.erased': 'Cancellato tutto',

    'unsupported.title': 'Questo browser non può eseguire Hashcards',
    'unsupported.body':
      'Hashcards ha bisogno della Web Crypto API per calcolare gli hash, e qui non è disponibile. Apri l’app su https:// (o su localhost) con un browser aggiornato.'
  };

  DICTS.es = {
    'app.tagline': 'Practica tus contraseñas. Nunca se guardan.',

    'nav.settings': 'Ajustes',
    'nav.back': 'Atrás',
    'nav.theme': 'Cambiar tema',
    'nav.language': 'Idioma',

    'home.cards': 'Tarjetas',
    'home.due': 'Pendientes',
    'home.accuracy': 'Aciertos',
    'home.start': 'Empezar el repaso',
    'home.startDue': 'Repasar las {n} pendientes',
    'home.startAll': 'Repasar todas las tarjetas',
    'home.caughtUp': 'Ahora mismo no hay nada pendiente: vuelve más tarde o repasa igualmente el mazo entero.',
    'home.list': 'Tus tarjetas',
    'home.add': 'Añadir tarjeta',
    'home.empty.title': 'Todavía no hay tarjetas',
    'home.empty.body':
      'Añade una cuenta y la contraseña que quieres poder recordar. Hashcards guarda solo un hash con sal, así que la contraseña nunca se escribe en el disco: ni una sola vez.',
    'home.empty.cta': 'Añade tu primera tarjeta',

    'card.dueNow': 'Pendiente',
    'card.dueToday': 'Toca hoy',
    'card.dueTomorrow': 'Toca mañana',
    'card.dueInDays': 'Dentro de {n} días',
    'card.box': 'Caja {n}',
    'card.never': 'Nunca repasada',
    'card.score': '{correct} aciertos · {wrong} fallos',
    'card.edit': 'Editar',
    'card.delete': 'Eliminar',

    'study.progress': '{i} de {n}',
    'study.question': 'Cuál es la contraseña de',
    'study.placeholder': 'Escribe la contraseña',
    'study.check': 'Comprobar',
    'study.checking': 'Comprobando…',
    'study.skip': 'Saltar',
    'study.next': 'Siguiente',
    'study.retry': 'Reintentar',
    'study.correct': 'Coincide',
    'study.wrong': 'No coincide',
    'study.wrongHelp':
      'No se puede revelar nada: la contraseña no está guardada en ninguna parte, solo su hash.',
    'study.skipped': 'Saltada: cuenta como fallo.',
    'study.hintShow': 'Ver la pista',
    'study.hint': 'Pista',
    'study.reveal': 'Mostrar lo que escribo',
    'study.hide': 'Ocultar lo que escribo',
    'study.quit': 'Terminar la sesión',
    'study.done.title': 'Sesión terminada',
    'study.done.score': '{correct} recordadas de {total}',
    'study.done.perfect': 'Todas. ',
    'study.done.again': 'Otra vez',
    'study.done.home': 'Volver al mazo',

    'settings.title': 'Ajustes',
    'settings.appearance': 'Apariencia',
    'settings.theme': 'Tema',
    'settings.themeSystem': 'Sistema',
    'settings.themeLight': 'Claro',
    'settings.themeDark': 'Oscuro',
    'settings.language': 'Idioma',
    'settings.cards': 'Tarjetas',
    'settings.cardsHelp': 'Añade, renombra o elimina las cuentas con las que practicas.',
    'settings.data': 'Datos',
    'settings.export': 'Exportar el mazo',
    'settings.exportHelp':
      'Descarga un archivo JSON con los hashes, las sales y tu progreso: ninguna contraseña. Aun así guárdalo en privado, porque un hash se puede atacar sin conexión.',
    'settings.import': 'Importar un mazo',
    'settings.importHelp': 'Carga un archivo exportado por Hashcards, desde este u otro dispositivo.',
    'settings.erase': 'Borrarlo todo',
    'settings.eraseHelp':
      'Elimina para siempre de este navegador todas las tarjetas y el progreso. Como nunca han salido de aquí, no hay forma de recuperarlos.',
    'settings.how': 'Cómo funciona',
    'settings.howBody':
      'Al añadir una tarjeta, la contraseña pasa por PBKDF2-HMAC-SHA-256 — {iterations} iteraciones y una sal aleatoria de 16 bytes, distinta en cada tarjeta — y solo se guarda el resultado. Para comprobar una respuesta se vuelve a calcular el hash de lo que has escrito con la misma sal y se comparan los dos digests byte a byte, en tiempo constante. No hay servidor, ni cuenta, ni telemetría: todo ocurre en este navegador y se queda en su almacenamiento local.',
    'settings.about': 'Acerca de',
    'settings.aboutBody': 'Versión {version} · código abierto, licencia MIT.',
    'settings.source': 'Código fuente',

    'dialog.newCard': 'Nueva tarjeta',
    'dialog.editCard': 'Editar tarjeta',
    'dialog.name': 'Cuenta',
    'dialog.namePlaceholder': 'p. ej. Correo — personal',
    'dialog.hint': 'Pista',
    'dialog.hintOptional': 'opcional',
    'dialog.hintPlaceholder': 'Se muestra si la pides durante el repaso',
    'dialog.hintHelp': 'Se guarda tal cual, en claro. No escribas aquí la contraseña.',
    'dialog.password': 'Contraseña',
    'dialog.passwordRepeat': 'Repite la contraseña',
    'dialog.passwordHelp': 'Se convierte en hash en cuanto guardas. No se conserva y no se puede volver a ver.',
    'dialog.keepPassword': 'Mantener la contraseña actual',
    'dialog.changePassword': 'Sustituir la contraseña',
    'dialog.changePasswordHelp': 'La tarjeta vuelve a la primera caja.',
    'dialog.save': 'Guardar',
    'dialog.cancel': 'Cancelar',
    'dialog.hashing': 'Calculando el hash…',

    'dialog.delete.title': 'Eliminar la tarjeta',
    'dialog.delete.body': '¿Quitar «{name}» de este navegador? Se van con ella su hash y su progreso.',
    'dialog.delete.confirm': 'Eliminar la tarjeta',

    'dialog.erase.title': 'Borrarlo todo',
    'dialog.erase.body':
      'Se eliminarán de este navegador todas las tarjetas, todos los hashes y todo tu progreso. Los archivos que hayas exportado antes no se tocan.',
    'dialog.erase.ack': 'Entiendo que no se puede deshacer.',
    'dialog.erase.confirm': 'Borrarlo todo',

    'dialog.import.title': 'Importar un mazo',
    'dialog.import.file': 'Elegir un archivo',
    'dialog.import.or': 'o pega el JSON',
    'dialog.import.pastePlaceholder': 'Pega aquí el contenido de una exportación de Hashcards…',
    'dialog.import.mode': 'Tarjetas que ya están en el mazo',
    'dialog.import.merge': 'Actualizar las del mismo nombre y añadir el resto',
    'dialog.import.replace': 'Sustituir el mazo entero',
    'dialog.import.confirm': 'Importar',

    'error.nameRequired': 'Ponle un nombre a la tarjeta.',
    'error.nameTaken': 'Ya existe una tarjeta con este nombre.',
    'error.passwordRequired': 'Escribe la contraseña que quieres practicar.',
    'error.passwordMismatch': 'Las dos contraseñas no coinciden.',
    'error.importInvalid': 'Esto no es una exportación de Hashcards.',
    'error.importEmpty': 'Primero elige un archivo o pega el JSON.',
    'error.storageFull': 'El navegador no ha podido guardar. Puede que su almacenamiento esté lleno o bloqueado.',

    'toast.cardAdded': 'Tarjeta añadida',
    'toast.cardUpdated': 'Tarjeta actualizada',
    'toast.cardDeleted': 'Tarjeta eliminada',
    'toast.exported': 'Mazo exportado',
    'toast.imported': '{added} añadidas, {updated} actualizadas',
    'toast.erased': 'Todo borrado',

    'unsupported.title': 'Este navegador no puede ejecutar Hashcards',
    'unsupported.body':
      'Hashcards necesita la Web Crypto API para calcular los hashes, y aquí no está disponible. Abre la aplicación en https:// (o en localhost) con un navegador actualizado.'
  };

  DICTS.de = {
    'app.tagline': 'Passwörter üben. Gespeichert wird keines.',

    'nav.settings': 'Einstellungen',
    'nav.back': 'Zurück',
    'nav.theme': 'Design wechseln',
    'nav.language': 'Sprache',

    'home.cards': 'Karten',
    'home.due': 'Jetzt fällig',
    'home.accuracy': 'Trefferquote',
    'home.start': 'Wiederholung starten',
    'home.startDue': '{n} fällige wiederholen',
    'home.startAll': 'Alle Karten wiederholen',
    'home.caughtUp': 'Gerade ist nichts fällig — schau später wieder vorbei oder geh den ganzen Stapel trotzdem durch.',
    'home.list': 'Deine Karten',
    'home.add': 'Karte hinzufügen',
    'home.empty.title': 'Noch keine Karten',
    'home.empty.body':
      'Trag ein Konto ein und das Passwort, an das du dich erinnern können willst. Hashcards behält nur einen gesalzenen Hash davon — das Passwort selbst landet nie auf der Festplatte, kein einziges Mal.',
    'home.empty.cta': 'Erste Karte anlegen',

    'card.dueNow': 'Fällig',
    'card.dueToday': 'Heute fällig',
    'card.dueTomorrow': 'Morgen fällig',
    'card.dueInDays': 'In {n} Tagen',
    'card.box': 'Fach {n}',
    'card.never': 'Nie wiederholt',
    'card.score': '{correct} richtig · {wrong} falsch',
    'card.edit': 'Bearbeiten',
    'card.delete': 'Löschen',

    'study.progress': '{i} von {n}',
    'study.question': 'Wie lautet das Passwort für',
    'study.placeholder': 'Passwort eintippen',
    'study.check': 'Prüfen',
    'study.checking': 'Wird geprüft…',
    'study.skip': 'Überspringen',
    'study.next': 'Weiter',
    'study.retry': 'Nochmal',
    'study.correct': 'Stimmt überein',
    'study.wrong': 'Keine Übereinstimmung',
    'study.wrongHelp':
      'Es lässt sich nichts anzeigen: Das Passwort ist nirgends gespeichert, nur sein Hash.',
    'study.skipped': 'Übersprungen — zählt als Fehler.',
    'study.hintShow': 'Hinweis anzeigen',
    'study.hint': 'Hinweis',
    'study.reveal': 'Eingabe sichtbar machen',
    'study.hide': 'Eingabe verbergen',
    'study.quit': 'Sitzung beenden',
    'study.done.title': 'Sitzung beendet',
    'study.done.score': '{correct} von {total} erinnert',
    'study.done.perfect': 'Alle. ',
    'study.done.again': 'Noch eine Runde',
    'study.done.home': 'Zurück zum Stapel',

    'settings.title': 'Einstellungen',
    'settings.appearance': 'Darstellung',
    'settings.theme': 'Design',
    'settings.themeSystem': 'System',
    'settings.themeLight': 'Hell',
    'settings.themeDark': 'Dunkel',
    'settings.language': 'Sprache',
    'settings.cards': 'Karten',
    'settings.cardsHelp': 'Konten hinzufügen, umbenennen oder entfernen.',
    'settings.data': 'Daten',
    'settings.export': 'Stapel exportieren',
    'settings.exportHelp':
      'Lädt eine JSON-Datei mit Hashes, Salts und Fortschritt herunter — keine Passwörter. Behalte sie trotzdem für dich: Ein Hash lässt sich offline angreifen.',
    'settings.import': 'Stapel importieren',
    'settings.importHelp': 'Lade eine von Hashcards exportierte Datei, von diesem oder einem anderen Gerät.',
    'settings.erase': 'Alles löschen',
    'settings.eraseHelp':
      'Entfernt alle Karten und den gesamten Fortschritt endgültig aus diesem Browser. Da nie etwas verschickt wurde, ist auch nichts wiederherstellbar.',
    'settings.how': 'So funktioniert es',
    'settings.howBody':
      'Beim Anlegen einer Karte läuft das Passwort durch PBKDF2-HMAC-SHA-256 — {iterations} Iterationen und ein frischer, 16 Byte langer Zufalls-Salt pro Karte — und nur das Ergebnis wird gespeichert. Zum Prüfen wird die Eingabe mit demselben Salt erneut gehasht und die beiden Digests werden Byte für Byte in konstanter Zeit verglichen. Kein Server, kein Konto, keine Telemetrie: Alles passiert in diesem Browser und bleibt in dessen lokalem Speicher.',
    'settings.about': 'Über',
    'settings.aboutBody': 'Version {version} · quelloffen, MIT-Lizenz.',
    'settings.source': 'Quellcode',

    'dialog.newCard': 'Neue Karte',
    'dialog.editCard': 'Karte bearbeiten',
    'dialog.name': 'Konto',
    'dialog.namePlaceholder': 'z. B. E-Mail — privat',
    'dialog.hint': 'Hinweis',
    'dialog.hintOptional': 'optional',
    'dialog.hintPlaceholder': 'Wird auf Wunsch während der Wiederholung gezeigt',
    'dialog.hintHelp': 'Wird im Klartext gespeichert. Schreib hier niemals das Passwort hinein.',
    'dialog.password': 'Passwort',
    'dialog.passwordRepeat': 'Passwort wiederholen',
    'dialog.passwordHelp': 'Wird beim Speichern sofort gehasht. Es bleibt nicht erhalten und lässt sich nicht wieder anzeigen.',
    'dialog.keepPassword': 'Aktuelles Passwort behalten',
    'dialog.changePassword': 'Passwort ersetzen',
    'dialog.changePasswordHelp': 'Die Karte wandert zurück ins erste Fach.',
    'dialog.save': 'Speichern',
    'dialog.cancel': 'Abbrechen',
    'dialog.hashing': 'Wird gehasht…',

    'dialog.delete.title': 'Karte löschen',
    'dialog.delete.body': '„{name}“ aus diesem Browser entfernen? Hash und Fortschritt gehen mit.',
    'dialog.delete.confirm': 'Karte löschen',

    'dialog.erase.title': 'Alles löschen',
    'dialog.erase.body':
      'Alle Karten, alle Hashes und dein gesamter Fortschritt werden aus diesem Browser entfernt. Bereits exportierte Dateien bleiben unberührt.',
    'dialog.erase.ack': 'Mir ist klar, dass das nicht rückgängig zu machen ist.',
    'dialog.erase.confirm': 'Alles löschen',

    'dialog.import.title': 'Stapel importieren',
    'dialog.import.file': 'Datei wählen',
    'dialog.import.or': 'oder JSON einfügen',
    'dialog.import.pastePlaceholder': 'Inhalt eines Hashcards-Exports hier einfügen…',
    'dialog.import.mode': 'Karten, die es schon gibt',
    'dialog.import.merge': 'Gleichnamige aktualisieren, den Rest hinzufügen',
    'dialog.import.replace': 'Den ganzen Stapel ersetzen',
    'dialog.import.confirm': 'Importieren',

    'error.nameRequired': 'Gib der Karte einen Namen.',
    'error.nameTaken': 'Eine Karte mit diesem Namen gibt es bereits.',
    'error.passwordRequired': 'Tipp das Passwort ein, das du üben willst.',
    'error.passwordMismatch': 'Die beiden Eingaben stimmen nicht überein.',
    'error.importInvalid': 'Das ist kein Hashcards-Export.',
    'error.importEmpty': 'Wähl erst eine Datei oder füg das JSON ein.',
    'error.storageFull': 'Der Browser konnte nicht speichern. Möglicherweise ist der Speicher voll oder gesperrt.',

    'toast.cardAdded': 'Karte hinzugefügt',
    'toast.cardUpdated': 'Karte aktualisiert',
    'toast.cardDeleted': 'Karte gelöscht',
    'toast.exported': 'Stapel exportiert',
    'toast.imported': '{added} hinzugefügt, {updated} aktualisiert',
    'toast.erased': 'Alles gelöscht',

    'unsupported.title': 'Dieser Browser kann Hashcards nicht ausführen',
    'unsupported.body':
      'Hashcards braucht die Web-Crypto-API zum Hashen und findet sie hier nicht. Öffne die App über https:// (oder auf localhost) in einem aktuellen Browser.'
  };

  DICTS.fr = {
    'app.tagline': 'Entraîne-toi sur tes mots de passe. Aucun n’est conservé.',

    'nav.settings': 'Réglages',
    'nav.back': 'Retour',
    'nav.theme': 'Changer de thème',
    'nav.language': 'Langue',

    'home.cards': 'Cartes',
    'home.due': 'À réviser',
    'home.accuracy': 'Réussite',
    'home.start': 'Commencer la révision',
    'home.startDue': 'Réviser les {n} en attente',
    'home.startAll': 'Réviser toutes les cartes',
    'home.caughtUp': 'Rien à réviser pour l’instant : reviens plus tard, ou reprends quand même tout le paquet.',
    'home.list': 'Tes cartes',
    'home.add': 'Ajouter une carte',
    'home.empty.title': 'Aucune carte',
    'home.empty.body':
      'Ajoute un compte et le mot de passe que tu veux réussir à retrouver. Hashcards n’en garde qu’une empreinte salée : le mot de passe lui-même n’est jamais écrit sur le disque, pas une seule fois.',
    'home.empty.cta': 'Créer la première carte',

    'card.dueNow': 'À réviser',
    'card.dueToday': 'À réviser aujourd’hui',
    'card.dueTomorrow': 'À réviser demain',
    'card.dueInDays': 'Dans {n} jours',
    'card.box': 'Boîte {n}',
    'card.never': 'Jamais révisée',
    'card.score': '{correct} justes · {wrong} ratées',
    'card.edit': 'Modifier',
    'card.delete': 'Supprimer',

    'study.progress': '{i} sur {n}',
    'study.question': 'Quel est le mot de passe de',
    'study.placeholder': 'Saisis le mot de passe',
    'study.check': 'Vérifier',
    'study.checking': 'Vérification…',
    'study.skip': 'Passer',
    'study.next': 'Suivant',
    'study.retry': 'Réessayer',
    'study.correct': 'Ça correspond',
    'study.wrong': 'Ça ne correspond pas',
    'study.wrongHelp':
      'Rien ne peut être révélé : le mot de passe n’est stocké nulle part, seulement son empreinte.',
    'study.skipped': 'Passée : comptée comme ratée.',
    'study.hintShow': 'Afficher l’indice',
    'study.hint': 'Indice',
    'study.reveal': 'Afficher ce que je tape',
    'study.hide': 'Masquer ce que je tape',
    'study.quit': 'Terminer la session',
    'study.done.title': 'Session terminée',
    'study.done.score': '{correct} retrouvés sur {total}',
    'study.done.perfect': 'Tous. ',
    'study.done.again': 'On recommence',
    'study.done.home': 'Retour au paquet',

    'settings.title': 'Réglages',
    'settings.appearance': 'Apparence',
    'settings.theme': 'Thème',
    'settings.themeSystem': 'Système',
    'settings.themeLight': 'Clair',
    'settings.themeDark': 'Sombre',
    'settings.language': 'Langue',
    'settings.cards': 'Cartes',
    'settings.cardsHelp': 'Ajoute, renomme ou supprime les comptes que tu révises.',
    'settings.data': 'Données',
    'settings.export': 'Exporter le paquet',
    'settings.exportHelp':
      'Télécharge un fichier JSON avec les empreintes, les sels et ta progression — aucun mot de passe. Garde-le privé quand même : une empreinte s’attaque hors ligne.',
    'settings.import': 'Importer un paquet',
    'settings.importHelp': 'Charge un fichier exporté par Hashcards, depuis cet appareil ou un autre.',
    'settings.erase': 'Tout effacer',
    'settings.eraseHelp':
      'Supprime définitivement de ce navigateur toutes les cartes et toute la progression. Rien n’ayant jamais été envoyé ailleurs, rien n’est récupérable.',
    'settings.how': 'Comment ça marche',
    'settings.howBody':
      'À la création d’une carte, le mot de passe passe par PBKDF2-HMAC-SHA-256 — {iterations} itérations et un sel aléatoire de 16 octets, différent pour chaque carte — et seul le résultat est enregistré. Pour vérifier une réponse, l’app recalcule l’empreinte de ce que tu as tapé avec le même sel et compare les deux condensés octet par octet, en temps constant. Aucun serveur, aucun compte, aucune télémétrie : tout se passe dans ce navigateur et reste dans son stockage local.',
    'settings.about': 'À propos',
    'settings.aboutBody': 'Version {version} · code ouvert, licence MIT.',
    'settings.source': 'Code source',

    'dialog.newCard': 'Nouvelle carte',
    'dialog.editCard': 'Modifier la carte',
    'dialog.name': 'Compte',
    'dialog.namePlaceholder': 'ex. E-mail — perso',
    'dialog.hint': 'Indice',
    'dialog.hintOptional': 'facultatif',
    'dialog.hintPlaceholder': 'Affiché à la demande pendant la révision',
    'dialog.hintHelp': 'Enregistré tel quel, en clair. N’y mets jamais le mot de passe.',
    'dialog.password': 'Mot de passe',
    'dialog.passwordRepeat': 'Répète le mot de passe',
    'dialog.passwordHelp': 'Il est haché dès l’enregistrement. Il n’est pas conservé et ne pourra plus être affiché.',
    'dialog.keepPassword': 'Garder le mot de passe actuel',
    'dialog.changePassword': 'Remplacer le mot de passe',
    'dialog.changePasswordHelp': 'La carte repart dans la première boîte.',
    'dialog.save': 'Enregistrer',
    'dialog.cancel': 'Annuler',
    'dialog.hashing': 'Hachage…',

    'dialog.delete.title': 'Supprimer la carte',
    'dialog.delete.body': 'Retirer « {name} » de ce navigateur ? Son empreinte et sa progression partent avec.',
    'dialog.delete.confirm': 'Supprimer la carte',

    'dialog.erase.title': 'Tout effacer',
    'dialog.erase.body':
      'Toutes les cartes, toutes les empreintes et toute ta progression seront retirées de ce navigateur. Les fichiers déjà exportés ne sont pas touchés.',
    'dialog.erase.ack': 'Je comprends que c’est irréversible.',
    'dialog.erase.confirm': 'Tout effacer',

    'dialog.import.title': 'Importer un paquet',
    'dialog.import.file': 'Choisir un fichier',
    'dialog.import.or': 'ou colle le JSON',
    'dialog.import.pastePlaceholder': 'Colle ici le contenu d’un export Hashcards…',
    'dialog.import.mode': 'Cartes déjà présentes',
    'dialog.import.merge': 'Mettre à jour celles du même nom, ajouter les autres',
    'dialog.import.replace': 'Remplacer tout le paquet',
    'dialog.import.confirm': 'Importer',

    'error.nameRequired': 'Donne un nom à la carte.',
    'error.nameTaken': 'Une carte porte déjà ce nom.',
    'error.passwordRequired': 'Saisis le mot de passe que tu veux travailler.',
    'error.passwordMismatch': 'Les deux saisies ne correspondent pas.',
    'error.importInvalid': 'Ceci n’est pas un export Hashcards.',
    'error.importEmpty': 'Choisis d’abord un fichier ou colle le JSON.',
    'error.storageFull': 'Le navigateur a refusé d’enregistrer. Son stockage est peut-être plein ou bloqué.',

    'toast.cardAdded': 'Carte ajoutée',
    'toast.cardUpdated': 'Carte mise à jour',
    'toast.cardDeleted': 'Carte supprimée',
    'toast.exported': 'Paquet exporté',
    'toast.imported': '{added} ajoutées, {updated} mises à jour',
    'toast.erased': 'Tout est effacé',

    'unsupported.title': 'Ce navigateur ne peut pas exécuter Hashcards',
    'unsupported.body':
      'Hashcards a besoin de la Web Crypto API pour hacher les mots de passe, et elle est absente ici. Ouvre l’app en https:// (ou sur localhost) avec un navigateur à jour.'
  };

  var LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'it', label: 'Italiano' },
    { code: 'es', label: 'Español' },
    { code: 'de', label: 'Deutsch' },
    { code: 'fr', label: 'Français' }
  ];

  var current = 'en';

  function detect() {
    var candidates = (global.navigator.languages || [global.navigator.language || 'en']).slice();
    for (var i = 0; i < candidates.length; i++) {
      var code = String(candidates[i]).toLowerCase().split('-')[0];
      if (DICTS[code]) return code;
    }
    return 'en';
  }

  function setLang(code) {
    current = DICTS[code] ? code : 'en';
    global.document.documentElement.lang = current;
    return current;
  }

  function lang() {
    return current;
  }

  function fill(text, vars) {
    if (!vars) return text;
    return text.replace(/\{(\w+)\}/g, function (match, key) {
      return Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : match;
    });
  }

  function t(key, vars) {
    var value = DICTS[current][key];
    if (value == null) value = DICTS.en[key];
    if (value == null) return key;
    return fill(value, vars);
  }

  /* Development aid: which keys a translation is still missing. */
  function missing() {
    var report = {};
    Object.keys(DICTS).forEach(function (code) {
      if (code === 'en') return;
      var gaps = Object.keys(DICTS.en).filter(function (key) {
        return DICTS[code][key] == null;
      });
      if (gaps.length) report[code] = gaps;
    });
    return report;
  }

  HC.i18n = {
    t: t,
    lang: lang,
    setLang: setLang,
    detect: detect,
    missing: missing,
    LANGUAGES: LANGUAGES
  };
})(window);
