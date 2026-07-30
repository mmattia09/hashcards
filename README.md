# Hashcards

[![Deploy](https://img.shields.io/github/actions/workflow/status/mmattia09/hashcards/static.yml?branch=main&label=deploy&style=for-the-badge)](https://github.com/mmattia09/hashcards/actions/workflows/static.yml)
[![GitHub Pages](https://img.shields.io/badge/play-online-5b5bd6?style=for-the-badge)](https://mmattia09.github.io/hashcards/)
[![Dependencies](https://img.shields.io/badge/dependencies-0-16794a?style=for-the-badge)](#project-structure)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

Flashcards for the passwords you are supposed to know by heart. The app names an
account, you type the password from memory, and it tells you whether you got it
right — **without ever having seen the password**. What it stores is a salted
PBKDF2-SHA-256 digest, computed the moment you add the card. There is nothing to
leak back, not even to you.

A password you only ever paste from a manager is a password you will not have
when the manager is not there. This is practice for that day: a locked phone, a
fresh machine, a vault that wants its own master password. Spaced repetition
decides what comes up and when.

Static HTML, CSS and JavaScript — no framework, no build, no server, no account.
It runs offline after the first visit and installs to a phone's home screen.

> Try it: <https://mmattia09.github.io/hashcards/>

## Features

- **The password is never stored** — adding a card hashes it and drops it.
  Nothing in the app, the export file or the browser's storage can reproduce it,
  which is also why a card can never be "revealed": there is nothing to reveal.
- **PBKDF2-HMAC-SHA-256, 600 000 iterations** — [OWASP's floor][owasp] for that
  algorithm, with a fresh 16-byte random salt per card and a 256-bit digest.
  Answers are compared in constant time.
- **Spaced repetition** — five Leitner boxes with intervals of 1, 3, 8, 21 and
  60 days. A card you get right on the first try moves up a box; one you miss
  goes back to the first and comes round again today.
- **Graded on the first attempt** — you can keep trying a card as long as you
  like, but only the first answer counts. Retrying is for your memory, not for
  your score.
- **Optional hints** — a line of your own, shown only when you ask for it during
  a review. Stored in clear, and the dialog says so.
- **Nothing revealed on a miss** — a wrong answer says exactly that, and offers
  another go or a skip. Skipping counts as missed.
- **Change a password without losing the card** — editing offers *keep* or
  *replace*; replacing rehashes and sends the card back to the first box.
- **Export and import** — one JSON file with the hashes, salts and your
  progress. Import merges by name or replaces the deck outright; malformed or
  unverifiable records are dropped rather than stored.
- **Erase everything** — one button, one confirmation, and both localStorage
  keys are gone. Afterwards the app leaves nothing at all in this browser.
- **Five languages** — English, Italian, Spanish, German and French, picked in
  Settings or guessed from the browser on first visit.
- **Light and dark** — follows the system, with a manual override.
- **Offline and installable** — a service worker caches the shell; after the
  first visit it opens with no network, and it adds to the home screen.
- **No account, no server, no telemetry** — the app makes no network request
  after loading. Every byte it keeps is in this browser's local storage.

[owasp]: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

## How a review works

1. **Start review** takes the cards that are due, shuffled. **Review every card**
   ignores the schedule and runs the whole deck.
2. The card shows the account name. Type the password and press Enter.
3. The app hashes what you typed with that card's salt and compares the digests.
   It takes about a fifth of a second — that delay is the point of the KDF.
4. **A match** promotes the card and moves on. **No match** says so and lets you
   try again; the card is already marked missed, and will be back today.
5. At the end you get the score: how many you recalled first time.

Quitting a session mid-card records nothing for that card.

## Security

What is stored, per card: the account name, your optional hint, a random salt,
the PBKDF2 digest, the KDF parameters, and the review schedule. What is not
stored, anywhere, in any form: the password.

**Your deck is still worth protecting.** A digest is not plaintext, but it is
offline-attackable: anyone who copies it can guess passwords against it as fast
as their hardware allows. 600 000 iterations makes that expensive, not
impossible — a weak password will still fall. Treat an export file the way you
would treat any password-adjacent material, and remember that account *names*
and *hints* are in there in clear.

**Threat model, plainly.** Hashcards defends against the disclosure of your
passwords by the app itself: there is no server to breach, no sync, no
plaintext at rest, and nothing to phish out of the interface. It does not
defend against a compromised browser or machine — anything that can read your
keystrokes reads the password as you type it, whatever the app does with it
afterwards. It is a study tool, not a password manager, and it will never be
able to tell you a password you have forgotten.

**Why PBKDF2.** It is the only password-hashing KDF the Web Crypto API offers.
Argon2 or scrypt would be stronger per unit of work, but both would mean
shipping a WASM dependency, and this app has none. The parameters are saved per
card, so raising the iteration count later leaves existing cards verifiable.

Passwords are normalised to Unicode NFC before hashing, so a character typed on
one keyboard layout still matches the same character typed on another.

## Languages

English, Italian, Spanish, German and French. The dictionaries live in
[`js/i18n.js`](js/i18n.js); English is the source of truth, and
`HC.i18n.missing()` reports any key a translation has not caught up with — CI
runs it and fails the build, so a missing string cannot reach the site.

Adding a language is one object plus one entry in `LANGUAGES`.

## Project structure

No dependencies and no build step: what is in the repository is what runs in the
browser.

```
index.html              — every screen, one page
style.css               — tokens, light and dark theme
js/
  crypto.js             — PBKDF2 hashing, verification, constant-time compare
  store.js              — localStorage, Leitner scheduling, export/import
  i18n.js               — the five dictionaries
  icons.js              — inline SVG icons
  app.js                — views, review session, settings
sw.js                   — service worker, offline shell
manifest.webmanifest    — PWA metadata
icons/                  — app icon, favicon, PNG renders
tools/check-i18n.js     — translation completeness check (used by CI)
```

The modules are plain scripts hanging off a single `HC` global rather than ES
modules, so the app also works when opened straight from the file system.

## Export format

`hashcards-YYYY-MM-DD.json`:

```json
{
  "format": "hashcards.deck",
  "version": 1,
  "exportedAt": "2026-07-30T18:20:00.000Z",
  "cards": [
    {
      "name": "Email — personal",
      "hint": "the one from 2019",
      "kdf": { "name": "PBKDF2", "hash": "SHA-256", "iterations": 600000, "salt": "…" },
      "digest": "…",
      "box": 3,
      "dueAt": 1785000000000,
      "correct": 7,
      "wrong": 1
    }
  ]
}
```

Importing checks every record before it is stored — the KDF must be one the app
can run, and the salt and digest must decode to sensible lengths. Anything that
fails is dropped, so a hand-edited file cannot leave an uncheckable card in the
deck.

## Data stored on the device

| Key | Where | What it holds |
|-----|-------|---------------|
| `hashcards.deck.v1` | localStorage | Every card: name, hint, salt, digest, KDF parameters, schedule and counters |
| `hashcards.prefs.v1` | localStorage | Chosen language and theme |

There is no backend. Clearing the site's data — or pressing **Erase everything**
— returns the app to its initial state, with nothing recoverable.

## Local development

The app runs from `file://`, but a real server is closer to production and the
service worker needs one:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Before opening a PR, run what CI runs:

```bash
node tools/check-i18n.js && for f in js/*.js sw.js; do node --check "$f"; done
```

When you change `style.css`, anything under `js/` or `sw.js`, bump the version in
three places: the `?v=` parameter on the tags in `index.html`, the matching
entries in `SHELL`, and the `CACHE` constant in `sw.js`. Without that, anyone who
has already opened the app keeps being served the cached copy.

## Deploy

Every push to `main` publishes to **GitHub Pages** through
[`.github/workflows/static.yml`](.github/workflows/static.yml), after the syntax
and translation checks pass. Nothing is compiled; the repository is uploaded as
it stands.

## Support

Questions and bug reports → [GitHub Issues](https://github.com/mmattia09/hashcards/issues).

## Roadmap

- **Optional passphrase-encrypted deck**, so the hashes themselves are not
  readable by anything that can read localStorage.
- **Argon2id** behind a feature flag, if it can be done without a heavy
  dependency.
- **A typing-accuracy view** — which characters you get wrong, without ever
  showing the password.

## Authors and acknowledgment

Made by [@mmattia09](https://github.com/mmattia09). Developed with the help of
[Claude Code](https://claude.com/claude-code).

## License

[MIT](LICENSE).

## Project status

**Active** — the app does what its author needs it to do. Fixes and small
improvements land as needed; the roadmap above is best-effort.
