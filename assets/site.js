// Buddy Dolly Company — small progressive enhancements.
// Forms submit as plain HTML POSTs to Formspree (same as the original site);
// nothing here is required for a submission to go through.
(function () {
  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  // Demo video: respect reduced motion, offer pause/play
  var video = document.querySelector('.viewport video');
  var vbtn = document.querySelector('.video-toggle');
  if (video && vbtn) {
    var icons = {
      pause: '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" fill="currentColor"/><rect x="9.5" y="2" width="3.5" height="12" fill="currentColor"/></svg>',
      play: '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2l10 6-10 6z" fill="currentColor"/></svg>'
    };
    function sync() {
      var paused = video.paused;
      vbtn.innerHTML = paused ? icons.play : icons.pause;
      vbtn.setAttribute('aria-label', paused ? 'Play demo animation' : 'Pause demo animation');
    }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.removeAttribute('autoplay'); video.pause();
    }
    vbtn.addEventListener('click', function () { video.paused ? video.play() : video.pause(); });
    video.addEventListener('play', sync); video.addEventListener('pause', sync);
    sync();
  }

  // Buttons that open the contact form with a preset "interest"
  document.querySelectorAll('[data-interest]').forEach(function (el) {
    el.addEventListener('click', function () {
      var sel = document.getElementById('c-interest');
      if (sel) sel.value = el.getAttribute('data-interest');
    });
  });
  // Also support links like /?interest=manufacture#contact
  var m = /[?&]interest=([a-z]+)/.exec(location.search);
  var sel0 = document.getElementById('c-interest');
  if (m && sel0) {
    for (var i = 0; i < sel0.options.length; i++) if (sel0.options[i].value === m[1]) sel0.value = m[1];
  }

  // Forms: collect checkbox groups into one field, show sending state
  document.querySelectorAll('form[data-enhance]').forEach(function (form) {
    form.addEventListener('submit', function () {
      var hidden = form.querySelector('input[name="channels"]');
      if (hidden) {
        var picked = [];
        form.querySelectorAll('[data-channel]:checked').forEach(function (c) { picked.push(c.value); });
        hidden.value = picked.join(', ');
      }
      var btn = form.querySelector('button[type=submit]');
      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = 'Sending…'; }
      // If the person comes back with the Back button, re-enable the button
      window.addEventListener('pageshow', function () {
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || 'Send'; }
      }, { once: true });
    });
  });
})();
