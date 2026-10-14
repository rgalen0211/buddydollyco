// Buddy Dolly Company. Enhancements only: the forms submit as plain HTML POSTs
// to Formspree, so they work even if this file never loads.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Demo: caption and dots follow the animation; a dot holds that pose ----
  var video = document.getElementById('buddy-video');
  var dots = Array.prototype.slice.call(document.querySelectorAll('.dot'));
  var caption = document.querySelector('.caption');
  if (video && dots.length) {
    var held = null, resume = null;
    if (reduce) { video.removeAttribute('autoplay'); video.pause(); held = dots[0]; }
    var paint = function () {
      var t = video.currentTime, current = held;
      if (!current) dots.forEach(function (d) { if (t >= +d.dataset.from && t < +d.dataset.to) current = d; });
      dots.forEach(function (d) { d.setAttribute('aria-pressed', d === current ? 'true' : 'false'); });
      if (current && caption && caption.textContent !== current.dataset.caption) caption.textContent = current.dataset.caption;
    };
    var loop = function () { paint(); if (!video.paused) requestAnimationFrame(loop); };
    dots.forEach(function (d) {
      d.addEventListener('click', function () {
        if (held === d && !reduce) { clearTimeout(resume); held = null; video.play(); return; }
        held = d; video.pause(); video.currentTime = +d.dataset.hold; paint();
        clearTimeout(resume);
        if (!reduce) resume = setTimeout(function () { held = null; video.play(); }, 3500);
      });
    });
    video.addEventListener('play', function () { held = null; requestAnimationFrame(loop); });
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
