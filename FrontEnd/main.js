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

// Dark/Light mode toggle
const modeToggle = document.getElementById('modeToggle');
modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  document.body.classList.toggle('light-mode');
  modeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// Example CTA buttons
document.getElementById('getStartedBtn').addEventListener('click', () => {
  alert("Sign Up flow goes here!");
});

document.getElementById('seeDemoBtn').addEventListener('click', () => {
  alert("Demo of RiseFaze core loop!");
});

document.getElementById('startJourneyBtn').addEventListener('click', () => {
  alert("Core loop prototype opens!");
});

// Floating Feedback Button
const feedbackBtn = document.getElementById('feedbackBtn');
feedbackBtn.addEventListener('click', () => {
  alert("Feedback form opens here! Share your thoughts about RiseFaze.");
});
