/* Hashcards — password hashing.
 *
 * Everything here runs on the Web Crypto API: no dependencies, no network.
 * A password is turned into a PBKDF2-SHA-256 digest with a per-card random
 * salt and never leaves this function in readable form.
 */
(function (global) {
  'use strict';

  var HC = (global.HC = global.HC || {});

  // OWASP's 2023 floor for PBKDF2-HMAC-SHA-256. Stored per card, so raising it
  // later keeps existing cards verifiable.
  var ITERATIONS = 600000;
  var HASH = 'SHA-256';
  var DIGEST_BITS = 256;
  var SALT_BYTES = 16;

  var subtle = global.crypto && global.crypto.subtle;

  function supported() {
    return !!(subtle && subtle.importKey && subtle.deriveBits && global.crypto.getRandomValues);
  }

  function randomBytes(n) {
    var out = new Uint8Array(n);
    global.crypto.getRandomValues(out);
    return out;
  }

  function toBase64(bytes) {
    var s = '';
    for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return global.btoa(s);
  }

  function fromBase64(str) {
    var s = global.atob(str);
    var out = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
    return out;
  }

  // Two keyboards can produce the same accented character with different code
  // points. NFC folds those together so "è" typed on any layout still matches.
  function encode(password) {
    return new TextEncoder().encode(String(password).normalize('NFC'));
  }

  function derive(password, salt, iterations, hash, bits) {
    return subtle
      .importKey('raw', encode(password), 'PBKDF2', false, ['deriveBits'])
      .then(function (key) {
        return subtle.deriveBits(
          { name: 'PBKDF2', salt: salt, iterations: iterations, hash: hash },
          key,
          bits
        );
      })
      .then(function (buf) {
        return new Uint8Array(buf);
      });
  }

  /* Hash a password for storage. Returns the digest plus the parameters needed
   * to reproduce it — the password itself is dropped on return. */
  function hash(password) {
    var salt = randomBytes(SALT_BYTES);
    return derive(password, salt, ITERATIONS, HASH, DIGEST_BITS).then(function (digest) {
      return {
        kdf: {
          name: 'PBKDF2',
          hash: HASH,
          iterations: ITERATIONS,
          salt: toBase64(salt)
        },
        digest: toBase64(digest)
      };
    });
  }

  /* Recompute the digest with the card's own parameters and compare. */
  function verify(password, record) {
    if (!record || !record.kdf || !record.digest) return Promise.resolve(false);
    var kdf = record.kdf;
    if (kdf.name !== 'PBKDF2') return Promise.resolve(false);
    var salt, expected;
    try {
      salt = fromBase64(kdf.salt);
      expected = fromBase64(record.digest);
    } catch (e) {
      return Promise.resolve(false);
    }
    return derive(password, salt, kdf.iterations, kdf.hash, expected.length * 8).then(function (
      actual
    ) {
      return equal(actual, expected);
    });
  }

  /* Comparison that takes the same time whichever byte differs. */
  function equal(a, b) {
    if (a.length !== b.length) return false;
    var diff = 0;
    for (var i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
    return diff === 0;
  }

  /* Shape check for imported records: enough to refuse a file that would
   * otherwise sit in storage as an uncheckable card. */
  function validRecord(record) {
    if (!record || typeof record !== 'object') return false;
    var kdf = record.kdf;
    if (!kdf || kdf.name !== 'PBKDF2') return false;
    if (typeof kdf.hash !== 'string' || !/^SHA-(1|256|384|512)$/.test(kdf.hash)) return false;
    if (!Number.isInteger(kdf.iterations) || kdf.iterations < 1 || kdf.iterations > 10000000) {
      return false;
    }
    if (typeof kdf.salt !== 'string' || typeof record.digest !== 'string') return false;
    try {
      return fromBase64(kdf.salt).length > 0 && fromBase64(record.digest).length >= 16;
    } catch (e) {
      return false;
    }
  }

  HC.crypto = {
    supported: supported,
    hash: hash,
    verify: verify,
    validRecord: validRecord,
    ITERATIONS: ITERATIONS
  };
})(window);
