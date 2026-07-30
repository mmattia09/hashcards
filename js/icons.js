/* Hashcards — inline SVG icons.
 *
 * Hand-written paths injected into every [data-icon] element: no icon font, no
 * network request, and the colour follows the surrounding text.
 */
(function (global) {
  'use strict';

  var HC = (global.HC = global.HC || {});

  var S =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">';

  var PATHS = {
    // a deck of cards with a keyhole on the top one — the app mark
    logo:
      '<rect x="8" y="3" width="13" height="15" rx="2.6" stroke-opacity=".45"/>' +
      '<rect x="3" y="6" width="13" height="15" rx="2.6"/>' +
      '<circle cx="9.5" cy="12" r="1.7" fill="currentColor" stroke="none"/>' +
      '<path d="M9.5 13.7v2.6"/>',
    settings:
      '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.33-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15 4.6a1.7 1.7 0 0 0 1.87-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9v.01a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1z"/>',
    theme: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    check: '<path d="M4 12.5l5.2 5.2L20 7"/>',
    cross: '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    'eye-off':
      '<path d="M9.9 5.8A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3.2 4.1M6.5 7.4A17 17 0 0 0 2.5 12S6 18.5 12 18.5c1 0 1.9-.2 2.7-.5"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/><path d="M3 3l18 18"/>',
    pencil: '<path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17v3z"/>',
    trash: '<path d="M4 7h16M9.5 7V5.5A1.5 1.5 0 0 1 11 4h2a1.5 1.5 0 0 1 1.5 1.5V7M6.5 7l.8 12.1A2 2 0 0 0 9.3 21h5.4a2 2 0 0 0 2-1.9L17.5 7"/>',
    download: '<path d="M12 3.5v11M7.5 10.5l4.5 4.5 4.5-4.5M4.5 19.5h15"/>',
    upload: '<path d="M12 15.5v-11M7.5 8.5L12 4l4.5 4.5M4.5 19.5h15"/>',
    cards:
      '<rect x="3" y="7.5" width="13" height="13" rx="2.2"/><path d="M7.5 4.5h11a2 2 0 0 1 2 2v11"/>',
    trophy:
      '<path d="M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M7 6H4.5v1.5A3.5 3.5 0 0 0 8 11M17 6h2.5v1.5A3.5 3.5 0 0 1 16 11"/><path d="M12 14v3.5M8.5 20.5h7"/>'
  };

  function svg(name) {
    var path = PATHS[name];
    return path ? S + path + '</svg>' : '';
  }

  /* Replace the contents of every [data-icon] under root. */
  function paint(root) {
    var scope = root || global.document;
    var nodes = scope.querySelectorAll('[data-icon]');
    for (var i = 0; i < nodes.length; i++) {
      var markup = svg(nodes[i].getAttribute('data-icon'));
      if (markup) nodes[i].innerHTML = markup;
    }
  }

  HC.icons = { svg: svg, paint: paint };
})(window);
