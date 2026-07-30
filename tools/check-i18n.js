/* Fails if any translation is missing a key that English has, or carries one
 * English does not. Run it with `node tools/check-i18n.js`. */
'use strict';

global.window = { navigator: {}, document: { documentElement: {} } };
require('../js/i18n.js');

var i18n = global.window.HC.i18n;
var missing = i18n.missing();
var problems = Object.keys(missing);

if (problems.length) {
  problems.forEach(function (code) {
    console.error(code + ' is missing ' + missing[code].length + ' key(s):');
    missing[code].forEach(function (key) {
      console.error('  ' + key);
    });
  });
  process.exit(1);
}

console.log('All ' + i18n.LANGUAGES.length + ' languages are complete.');
