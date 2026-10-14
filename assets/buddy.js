// Forms post straight to Formspree as plain HTML; this only adds polish.
document.querySelectorAll('form[data-enhance]').forEach(function (form) {
  form.addEventListener('submit', function () {
    var hidden = form.querySelector('input[name="channels"]');
    if (hidden) hidden.value = Array.prototype.map.call(form.querySelectorAll('[data-channel]:checked'), function (c) { return c.value; }).join(', ');
    var btn = form.querySelector('button[type=submit]');
    if (btn) { btn.dataset.label = btn.textContent; btn.disabled = true; btn.textContent = 'Sending…'; }
  });
});
window.addEventListener('pageshow', function () {
  document.querySelectorAll('form[data-enhance] button[data-label]').forEach(function (b) { b.disabled = false; b.textContent = b.dataset.label; });
});
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { var v = document.querySelector('.demo'); if (v) { v.removeAttribute('autoplay'); v.pause(); } }
