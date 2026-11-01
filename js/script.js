/* WanderLux main script */
document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu
  var btn = document.querySelector('.menu-btn'), menu = document.querySelector('.nav ul');
  if (btn) btn.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });

  // Rotating banner
  var slides = document.querySelectorAll('.slide'), dots = document.querySelectorAll('.dots button'), cur = 0, timer;
  function show(i) {
    slides.forEach(function (s, n) { s.classList.toggle('active', n === i); });
    dots.forEach(function (d, n) { d.classList.toggle('on', n === i); });
    cur = i;
  }
  if (slides.length) {
    show(0);
    timer = setInterval(function () { show((cur + 1) % slides.length); }, 5000);
    dots.forEach(function (d, n) { d.addEventListener('click', function () { clearInterval(timer); show(n); }); });
  }

  // Scroll animations
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add('show'); }); }

  // Min date for date inputs
  var d = document.getElementById('date');
  if (d) d.min = new Date().toISOString().split('T')[0];

  // Form validation
  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (f) {
        var msg = '';
        if (!f.value.trim()) msg = 'This field is required.';
        else if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)) msg = 'Enter a valid email address.';
        else if (f.type === 'tel' && !/^[0-9+\s()-]{8,15}$/.test(f.value)) msg = 'Enter a valid phone number.';
        var err = document.getElementById(f.id + '-err');
        if (err) err.textContent = msg;
        if (msg) valid = false;
      });
      if (!valid) e.preventDefault();
    });
  });

  // Success message after form email is sent
  if (location.search.indexOf('sent=1') > -1) {
    var ok = document.getElementById('sent-msg');
    if (ok) ok.hidden = false;
  }

  // Trip Cost Calculator
  var calc = document.getElementById('calc-form');
  if (calc) {
    // per traveller per day, hotel per room per night, return flight per traveller (USD)
    var rates = {
      Bali: { daily: 120, hotel: 100, flight: 375 },
      Tokyo: { daily: 180, hotel: 150, flight: 1100 },
      Paris: { daily: 200, hotel: 180, flight: 1400 },
      Dubai: { daily: 190, hotel: 170, flight: 900 },
      Maldives: { daily: 250, hotel: 300, flight: 1300 }
    };
    var styles = { Budget: 0.7, Standard: 1, Luxury: 1.8 };
    calc.addEventListener('submit', function (e) {
      e.preventDefault();
      var dest = document.getElementById('destination').value;
      var trav = parseInt(document.getElementById('travellers').value, 10);
      var days = parseInt(document.getElementById('days').value, 10);
      var style = document.getElementById('style').value;
      var out = document.getElementById('result');
      var ok = true;
      [['destination', !dest], ['travellers', !(trav >= 1 && trav <= 20)], ['days', !(days >= 1 && days <= 60)], ['style', !style]].forEach(function (c) {
        document.getElementById(c[0] + '-err').textContent = c[1] ? 'Please enter a valid value.' : '';
        if (c[1]) ok = false;
      });
      if (!ok) { out.textContent = ''; return; }
      var r = rates[dest];
      var rooms = Math.ceil(trav / 2);
      var base = r.daily * trav * days + r.hotel * rooms * days + r.flight * trav;
      var total = Math.round(base * styles[style]);
      out.textContent = 'Estimated cost for ' + trav + ' traveller' + (trav > 1 ? 's' : '') + ' to ' + dest + ' for ' + days + ' days: $' + total.toLocaleString('en-US') + ' – ' + style + ' Travel Package.';
    });
  }
});
