// Lazy loading for sections
const lazyElements = document.querySelectorAll('.lazy-load');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{ threshold: 0.2 });

lazyElements.forEach(el => observer.observe(el));

// Dark/Light mode toggle (guard in case element missing)
const modeToggle = document.getElementById('modeToggle');
if (modeToggle) {
  modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    modeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
  });
}

// Navigation: wire CTAs to actual pages (safe checks)
const getStartedBtn = document.getElementById('getStartedBtn');
if (getStartedBtn) {
  getStartedBtn.addEventListener('click', () => {
    window.location.href = 'signup.html';
  });
}

const startJourneyBtn = document.getElementById('startJourneyBtn');
if (startJourneyBtn) {
  startJourneyBtn.addEventListener('click', () => {
    window.location.href = 'signup.html';
  });
}

const signupBtn = document.getElementById('signupBtn');
if (signupBtn) {
  signupBtn.addEventListener('click', () => {
    window.location.href = 'signup.html';
  });
}

const loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    window.location.href = 'login.html';
  });
}

const guestBtn = document.getElementById('guestBtn');
if (guestBtn) {
  guestBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}

// Optional/demo button (keep behavior if present)
const seeDemoBtn = document.getElementById('seeDemoBtn');
if (seeDemoBtn) {
  seeDemoBtn.addEventListener('click', () => {
    // navigate to demo page if you add one, otherwise keep placeholder
    alert("Demo of RiseFaze core loop!");
  });
}

// Floating Feedback Button (guard)
const feedbackBtn = document.getElementById('feedbackBtn');
if (feedbackBtn) {
  feedbackBtn.addEventListener('click', () => {
    // alert("Feedback form opens here! Share your thoughts about RiseFaze.");
    window.location.href = 'feedback.html';
  });
}
