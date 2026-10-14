// Buddy Dolly Company. Enhancements only: the forms submit as plain HTML POSTs
// to Formspree, so they work even if this file never loads.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Mode buttons follow the animation; clicking one holds that pose ----
  var video = document.getElementById('buddy-video');
  var modes = Array.prototype.slice.call(document.querySelectorAll('.mode'));
  var playBtn = document.querySelector('.play');
  if (video && modes.length) {
    var held = null;
    if (reduce) { video.removeAttribute('autoplay'); video.pause(); }

    var paint = function () {
      var t = video.currentTime;
      modes.forEach(function (m) {
        var from = +m.dataset.from, to = +m.dataset.to;
        var on = held ? held === m : (t >= from && t < to);
        m.setAttribute('aria-pressed', on ? 'true' : 'false');
        var bar = m.querySelector('.bar');
        if (bar) bar.style.width = held ? (on ? '100%' : '0') : (on ? Math.min(100, (t - from) / (to - from) * 100) + '%' : '0');
      });
      if (playBtn) playBtn.hidden = !video.paused;
    };
    var loop = function () { paint(); if (!video.paused) requestAnimationFrame(loop); };

    modes.forEach(function (m) {
      m.addEventListener('click', function () {
        if (held === m) { held = null; video.play(); return; }
        held = m;
        video.pause();
        video.currentTime = +m.dataset.hold;
        paint();
      });
    });
    if (playBtn) playBtn.addEventListener('click', function () { held = null; video.play(); });
    video.addEventListener('play', function () { held = null; requestAnimationFrame(loop); });
    video.addEventListener('pause', paint);
    video.addEventListener('seeked', paint);
    paint();
    if (!video.paused) requestAnimationFrame(loop);
  }

  // ---- Buttons that preset the contact form's "interest" ----
  var interest = document.getElementById('c-interest');
  document.querySelectorAll('[data-interest]').forEach(function (el) {
    el.addEventListener('click', function () { if (interest) interest.value = el.getAttribute('data-interest'); });
  });

  // ---- Forms: fold channel checkboxes into one field; show a sending state ----
  document.querySelectorAll('form[data-enhance]').forEach(function (form) {
    form.addEventListener('submit', function () {
      var hidden = form.querySelector('input[name="channels"]');
      if (hidden) {
        var picked = [];
        form.querySelectorAll('[data-channel]:checked').forEach(function (c) { picked.push(c.value); });
        hidden.value = picked.join(', ');
      }
      var btn = form.querySelector('button[type=submit]');
      if (btn) { btn.dataset.label = btn.textContent; btn.disabled = true; btn.textContent = 'Sending…'; }
    });
  });
  // Coming back with the Back button: restore the buttons
  window.addEventListener('pageshow', function () {
    document.querySelectorAll('form[data-enhance] button[type=submit]').forEach(function (btn) {
      if (btn.dataset.label) { btn.disabled = false; btn.textContent = btn.dataset.label; }
    });
  });
})();
