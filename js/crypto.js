/* Hashcards — password hashing and export encryption.
 *
 * Everything here runs on the Web Crypto API: no dependencies, no network.
 * A password is turned into a PBKDF2-SHA-256 digest with a per-card random
 * salt and never leaves this function in readable form. The same KDF, with a
 * fresh salt, derives the AES-GCM key that protects an exported deck.
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

  var CIPHER = 'AES-GCM';
  var CIPHER_BITS = 256;
  var IV_BYTES = 12;

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

  /* ---- recovery codes ----
   *
   * A set of codes shares one salt, so checking an answer costs a single
   * derivation instead of one per code. The salt is still random per card, so
   * nothing precomputed helps; the only thing a shared salt reveals is whether
   * two codes on the *same* card are identical, which they should never be.
   *
   * Codes are matched on their bare alphanumerics, folded to lower case:
   * "ABCD-EFGH" and "abcdefgh" are the same answer. Services print them in
   * whichever style they like, and a review should test your memory of the
   * code, not of its punctuation. */
  function codeForm(code) {
    return String(code)
      .normalize('NFKC')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  }

  /* onProgress(done, total) is called as each code is hashed — with the work
   * factor deliberately high, a set of ten is not instant. */
  function hashCodes(codes, onProgress) {
    var salt = randomBytes(SALT_BYTES);
    var digests = [];
    var chain = Promise.resolve();

    codes.forEach(function (code, index) {
      chain = chain
        .then(function () {
          return derive(codeForm(code), salt, ITERATIONS, HASH, DIGEST_BITS);
        })
        .then(function (digest) {
          digests.push(toBase64(digest));
          if (onProgress) onProgress(index + 1, codes.length);
        });
    });

    return chain.then(function () {
      return {
        kdf: {
          name: 'PBKDF2',
          hash: HASH,
          iterations: ITERATIONS,
          salt: toBase64(salt)
        },
        digests: digests
      };
    });
  }

  /* Resolves to the index of the code that matched, or -1. `only` limits the
   * search to the codes still outstanding in this review. */
  function verifyCode(code, card, only) {
    if (!validCodes(card)) return Promise.resolve(-1);
    var salt, expected;
    try {
      salt = fromBase64(card.kdf.salt);
      expected = card.digests.map(fromBase64);
    } catch (e) {
      return Promise.resolve(-1);
    }
    return derive(codeForm(code), salt, card.kdf.iterations, card.kdf.hash, DIGEST_BITS).then(
      function (actual) {
        var found = -1;
        for (var i = 0; i < expected.length; i++) {
          if (only && only.indexOf(i) === -1) continue;
          // No early exit: every candidate is compared, so a near miss costs
          // exactly what a match costs.
          if (equal(actual, expected[i]) && found === -1) found = i;
        }
        return found;
      }
    );
  }

  function validCodes(card) {
    if (!card || typeof card !== 'object' || !Array.isArray(card.digests)) return false;
    if (!card.digests.length) return false;
    if (!validKdf(card.kdf)) return false;
    try {
      return card.digests.every(function (d) {
        return typeof d === 'string' && fromBase64(d).length >= 16;
      });
    } catch (e) {
      return false;
    }
  }

  /* Comparison that takes the same time whichever byte differs. */
  function equal(a, b) {
    if (a.length !== b.length) return false;
    var diff = 0;
    for (var i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
    return diff === 0;
  }

  /* Shape checks for imported records: enough to refuse a file that would
   * otherwise sit in storage as an uncheckable card. */
  function validKdf(kdf) {
    if (!kdf || kdf.name !== 'PBKDF2') return false;
    if (typeof kdf.hash !== 'string' || !/^SHA-(1|256|384|512)$/.test(kdf.hash)) return false;
    if (!Number.isInteger(kdf.iterations) || kdf.iterations < 1 || kdf.iterations > 10000000) {
      return false;
    }
    if (typeof kdf.salt !== 'string') return false;
    try {
      return fromBase64(kdf.salt).length > 0;
    } catch (e) {
      return false;
    }
  }

  function validRecord(record) {
    if (!record || typeof record !== 'object') return false;
    if (!validKdf(record.kdf)) return false;
    if (typeof record.digest !== 'string') return false;
    try {
      return fromBase64(record.digest).length >= 16;
    } catch (e) {
      return false;
    }
  }

  /* ---- export encryption ----
   *
   * The same PBKDF2 work factor as a card, with its own salt, turned into an
   * AES-GCM key. GCM authenticates as well as encrypts, so a wrong passphrase
   * and a tampered file both come back as the same plain failure. */

  function deriveKey(passphrase, salt, iterations, hash, usage) {
    return subtle
      .importKey('raw', encode(passphrase), 'PBKDF2', false, ['deriveKey'])
      .then(function (base) {
        return subtle.deriveKey(
          { name: 'PBKDF2', salt: salt, iterations: iterations, hash: hash },
          base,
          { name: CIPHER, length: CIPHER_BITS },
          false,
          [usage]
        );
      });
  }

  /* Returns the parts of an encrypted envelope: the KDF parameters, the IV and
   * the ciphertext, all base64. The passphrase is not kept. */
  function encrypt(plaintext, passphrase) {
    var salt = randomBytes(SALT_BYTES);
    var iv = randomBytes(IV_BYTES);
    return deriveKey(passphrase, salt, ITERATIONS, HASH, 'encrypt')
      .then(function (key) {
        return subtle.encrypt(
          { name: CIPHER, iv: iv },
          key,
          new TextEncoder().encode(plaintext)
        );
      })
      .then(function (buf) {
        return {
          kdf: {
            name: 'PBKDF2',
            hash: HASH,
            iterations: ITERATIONS,
            salt: toBase64(salt)
          },
          cipher: { name: CIPHER, iv: toBase64(iv) },
          payload: toBase64(new Uint8Array(buf))
        };
      });
  }

  /* Rejects when the passphrase is wrong, when the file has been altered, or
   * when the envelope is not one we can read. Callers cannot tell the first two
   * apart, and neither can anyone else. */
  function decrypt(envelope, passphrase) {
    if (!validEnvelope(envelope)) return Promise.reject(new Error('bad envelope'));
    var salt, iv, data;
    try {
      salt = fromBase64(envelope.kdf.salt);
      iv = fromBase64(envelope.cipher.iv);
      data = fromBase64(envelope.payload);
    } catch (e) {
      return Promise.reject(new Error('bad envelope'));
    }
    return deriveKey(passphrase, salt, envelope.kdf.iterations, envelope.kdf.hash, 'decrypt')
      .then(function (key) {
        return subtle.decrypt({ name: CIPHER, iv: iv }, key, data);
      })
      .then(function (buf) {
        return new TextDecoder().decode(buf);
      });
  }

  /* Shape check for an encrypted file, so a malformed one fails as "not a
   * Hashcards export" rather than somewhere inside Web Crypto. */
  function validEnvelope(envelope) {
    if (!envelope || typeof envelope !== 'object') return false;
    var kdf = envelope.kdf;
    var cipher = envelope.cipher;
    if (!kdf || kdf.name !== 'PBKDF2') return false;
    if (typeof kdf.hash !== 'string' || !/^SHA-(256|384|512)$/.test(kdf.hash)) return false;
    if (!Number.isInteger(kdf.iterations) || kdf.iterations < 1 || kdf.iterations > 10000000) {
      return false;
    }
    if (!cipher || cipher.name !== CIPHER || typeof cipher.iv !== 'string') return false;
    if (typeof kdf.salt !== 'string' || typeof envelope.payload !== 'string') return false;
    try {
      return (
        fromBase64(kdf.salt).length > 0 &&
        fromBase64(cipher.iv).length === IV_BYTES &&
        fromBase64(envelope.payload).length > 16
      );
    } catch (e) {
      return false;
    }
  }

  HC.crypto = {
    supported: supported,
    hash: hash,
    verify: verify,
    hashCodes: hashCodes,
    verifyCode: verifyCode,
    codeForm: codeForm,
    validRecord: validRecord,
    validCodes: validCodes,
    encrypt: encrypt,
    decrypt: decrypt,
    validEnvelope: validEnvelope,
    ITERATIONS: ITERATIONS
  };
})(window);
