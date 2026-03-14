/* =========================================
   BOMA REWARDS — MAIN SCRIPT
   ========================================= */

/* ---- Scroll-activated nav shadow ---- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ---- Mobile nav toggle ---- */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ---- Fade-in on scroll ---- */
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));

/* ---- Value Calculator ---- */
const spendSlider   = document.getElementById('spendSlider');
const yearsSlider   = document.getElementById('yearsSlider');
const spendDisplay  = document.getElementById('spendDisplay');
const yearsDisplay  = document.getElementById('yearsDisplay');
const annualCashback = document.getElementById('annualCashback');
const totalRewards  = document.getElementById('totalRewards');
const portfolioValue = document.getElementById('portfolioValue');
const milestonesEl  = document.getElementById('milestones');

const CASHBACK_RATE  = 0.045; // 4.5% of monthly spend
const ANNUAL_RETURN  = 0.10; // 10% average investment return

function formatGBP(n) {
  return '£' + Math.round(n).toLocaleString('en-GB');
}

function futureValue(annual, years, rate) {
  // FV of growing annuity (end-of-year contributions)
  let total = 0;
  for (let y = 1; y <= years; y++) {
    total += annual * Math.pow(1 + rate, years - y + 1);
  }
  return total;
}

function updateCalculator() {
  const monthlySpend = parseInt(spendSlider.value, 10);
  const years        = parseInt(yearsSlider.value, 10);

  const cashbackMonthly = monthlySpend * CASHBACK_RATE;
  const cashbackAnnual  = cashbackMonthly * 12;
  const rawTotal        = cashbackAnnual * years;
  const fv              = futureValue(cashbackAnnual, years, ANNUAL_RETURN);

  spendDisplay.textContent  = formatGBP(monthlySpend);
  yearsDisplay.textContent  = `${years} year${years !== 1 ? 's' : ''}`;
  annualCashback.textContent = formatGBP(cashbackAnnual);
  totalRewards.textContent  = formatGBP(rawTotal);
  portfolioValue.textContent = formatGBP(fv);

  // Milestones
  const milestoneYears = [1, 5, 10, 20, 30];
  const maxFV = futureValue(cashbackAnnual, 30, ANNUAL_RETURN);

  milestonesEl.innerHTML = milestoneYears.map(y => {
    const val = futureValue(cashbackAnnual, y, ANNUAL_RETURN);
    const pct = Math.round((val / maxFV) * 100);
    return `
      <div class="milestone">
        <span class="milestone-year">${y} yr${y !== 1 ? 's' : ''}</span>
        <div class="milestone-bar-wrap">
          <div class="milestone-bar" style="width: ${pct}%"></div>
        </div>
        <span class="milestone-val">${formatGBP(val)}</span>
      </div>`;
  }).join('');
}

if (spendSlider && yearsSlider) {
  spendSlider.addEventListener('input', updateCalculator);
  yearsSlider.addEventListener('input', updateCalculator);
  updateCalculator(); // initial render
}

/* ---- Sign-up form ---- */
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signupForm.querySelector('input[type="email"]').value;
    const btn   = signupForm.querySelector('button[type="submit"]');
    btn.textContent = '✓ You\'re on the list!';
    btn.style.background = '#22C55E';
    btn.disabled = true;
    signupForm.querySelector('input').disabled = true;
    console.info('Sign-up submitted:', email);
  });
}

/* ---- Lucide icons ---- */
lucide.createIcons();

/* ---- Smooth scroll for anchor links (polyfill for Safari) ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
