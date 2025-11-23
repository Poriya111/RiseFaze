// Run this function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Lazy loading for sections
  const lazyElements = document.querySelectorAll('.lazy-load');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  });
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
      window.location.href = 'explore.html';
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
      window.location.href = 'feedback.html';
    });
  }

  // Signup form validation
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = this.fullname.value.trim();
      const email = this.email.value.trim();
      const pw = this.password.value;
      const confirm = this.confirm.value;
      if (!name || !email || !pw || !confirm) {
        alert('Please complete all required fields.');
        return;
      }
      if (pw !== confirm) {
        alert('Passwords do not match.');
        return;
      }
      alert('Account created — replace with backend integration.');
    });
  }

  // Login form validation
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = this.email.value.trim();
      const pw = this.password.value;
      if (!email || !pw) {
        alert('Please fill all required fields.');
        return;
      }
      alert('Signing in — replace with real auth flow.');
    });
  }

  // Create hidden buttons for pages that need them (signup, login)
  if (signupForm || loginForm) {
    const _hid = document.createElement('div');
    _hid.style.display = 'none';
    _hid.innerHTML = '<button id="getStartedBtn"></button><button id="seeDemoBtn"></button><button id="startJourneyBtn"></button>';
    document.body.appendChild(_hid);
  }

  // Asset Modal Logic (Dashboard)
  const assetModal = document.getElementById('assetModal');
  if (assetModal) {
    const moreButtons = document.querySelectorAll('.more-btn');
    const closeModalBtn = assetModal.querySelector('.modal-close-btn');

    moreButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const card = e.target.closest('.asset-card');
        const name = card.dataset.name;
        const price = card.dataset.price;
        const icon = card.dataset.icon;
        const description = card.dataset.description;

        // Populate modal
        assetModal.querySelector('#modalAssetName').textContent = name;
        assetModal.querySelector('#modalAssetPrice').textContent = price;
        assetModal.querySelector('.modal-asset-icon').textContent = icon;
        assetModal.querySelector('#modalAssetDescription').textContent = description;

        // Show modal
        assetModal.classList.add('visible');
      });
    });

    const closeModal = () => {
      assetModal.classList.remove('visible');
    };

    closeModalBtn.addEventListener('click', closeModal);
    assetModal.addEventListener('click', (e) => {
      // Close if clicked on the overlay itself, not the content
      if (e.target === assetModal) {
        closeModal();
      }
    });
  }

  // Navbar Popups Logic (Dashboard)
  const newsBtn = document.getElementById('newsBtn');
  const notificationsBtn = document.getElementById('notificationsBtn');
  const profileBtn = document.getElementById('profileBtn');

  const newsModal = document.getElementById('newsModal');
  const notificationsModal = document.getElementById('notificationsModal');
  const profilePopup = document.getElementById('profilePopup');

  const allPopups = [newsModal, notificationsModal, profilePopup, assetModal];

  const closeAllPopups = () => {
    allPopups.forEach(p => p && p.classList.remove('visible'));
  };

  const setupPopup = (button, popup) => {
    if (!button || !popup) return;

    button.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent closing immediately
      const isVisible = popup.classList.contains('visible');
      closeAllPopups();
      if (!isVisible) {
        popup.classList.add('visible');
      }
    });

    // Handle closing for modals
    const closeModalBtn = popup.querySelector('.modal-close-btn');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeAllPopups);
    }
  };

  setupPopup(newsBtn, newsModal);
  setupPopup(notificationsBtn, notificationsModal);
  setupPopup(profileBtn, profilePopup);

  // Global click listener to close popups
  document.addEventListener('click', (e) => {
    // If the click is outside a popup and not on a trigger button
    if (!e.target.closest('.modal-content, .profile-popup, .more-btn, .icon-btn')) {
      closeAllPopups();
    }
  });

});
