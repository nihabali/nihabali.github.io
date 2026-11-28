// Runs before the page paints. Sets light/dark (saved choice, else device setting) and the color palette.
// Palette: a different one on each new visit (never the same as last time). Set RANDOM=false to always use DEFAULT.
(function () {
  var PALS = ["green", "ocean", "sunset", "violet", "rose", "mono"], RANDOM = true, DEFAULT = "green";
  window.PALETTES = PALS;
  function get(s, k) { try { return s.getItem(k); } catch (e) { return null; } }
  function set(s, k, v) { try { s.setItem(k, v); } catch (e) {} }
  var t = get(localStorage, "theme");
  if (!t) t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  var p = get(sessionStorage, "pal");
  if (PALS.indexOf(p) < 0) {
    if (RANDOM) { var last = get(localStorage, "lastPal"), pool = PALS.filter(function (x) { return x !== last; }); p = pool[Math.floor(Math.random() * pool.length)]; }
    else p = DEFAULT;
    set(sessionStorage, "pal", p); set(localStorage, "lastPal", p);
  }
  document.documentElement.dataset.theme = t;
  document.documentElement.dataset.pal = p;
})();
