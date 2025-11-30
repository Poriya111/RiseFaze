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
    // Check for saved theme in localStorage and apply it on load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark-mode') {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      modeToggle.textContent = '☀️';
    } else {
      document.body.classList.add('light-mode'); // Default to light mode
    }

    modeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      document.body.classList.toggle('light-mode');
      modeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
      // Save the user's preference to localStorage
      localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode');
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
        document.body.classList.add('popup-open');
      });
    });

    const closeModal = () => {
      assetModal.classList.remove('visible');
    };

    // The closeModal function is only called when the asset modal is closed, so we can remove the class here.
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
    document.body.classList.remove('popup-open');
  };

  const setupPopup = (button, popup) => {
    if (!button || !popup) return;

    button.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent closing immediately
      const isVisible = popup.classList.contains('visible');
      closeAllPopups();
      if (!isVisible) {
        popup.classList.add('visible');
        document.body.classList.add('popup-open');
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

  // Contribution Graph Generation (Dashboard)
  const contributionContainer = document.querySelector('.graph-squares');
  if (contributionContainer) {
    // Clear any placeholder squares
    contributionContainer.innerHTML = ''; 

    const colors = ['#ebedf0', '#a3b8d1', '#5c83ad', '#285586', '#003169'];
    
    const today = new Date();
    const year = today.getFullYear();
    const startDate = new Date(year, 0, 1); // January 1st of the current year

    // Update the heading with the current year
    const graphHeading = document.getElementById('contribution-graph-heading');
    if (graphHeading) {
      graphHeading.textContent = `Your Activity in ${year}`;
    }

    // Determine the number of days in the current year (for leap years)
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    const daysInYear = isLeapYear ? 366 : 365;

    for (let i = 0; i < daysInYear; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      // Stop if the loop somehow spills into the next year
      if (currentDate.getFullYear() !== year) continue;

      const level = Math.floor(Math.random() * 5); // Random activity level
      const square = document.createElement('div');
      square.className = 'graph-square';
      square.style.backgroundColor = colors[level];
      square.title = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      contributionContainer.appendChild(square);
    }
  }

  // Performance Graph Logic (Dashboard)
  const chartCanvas = document.getElementById('performanceChart');
  if (chartCanvas) {
    const ctx = chartCanvas.getContext('2d');

    // --- Sample Data (replace with actual data from backend) ---
    const sampleData = {
      netWorth: {
        hourly: { labels: ['-5h', '-4h', '-3h', '-2h', '-1h', 'Now'], values: [1240, 1242, 1241, 1245, 1248, 1250] },
        daily: { labels: ['-6d', '-5d', '-4d', '-3d', '-2d', '-1d', 'Today'], values: [1190, 1200, 1210, 1205, 1220, 1230, 1250] },
        monthly: { labels: ['-5m', '-4m', '-3m', '-2m', '-1m', 'This Month'], values: [800, 950, 1000, 1100, 1150, 1250] }
      },
      rank: {
        hourly: { labels: ['-5h', '-4h', '-3h', '-2h', '-1h', 'Now'], values: [4825, 4824, 4826, 4822, 4820, 4821] },
        daily: { labels: ['-6d', '-5d', '-4d', '-3d', '-2d', '-1d', 'Today'], values: [5100, 5050, 4900, 4950, 4850, 4800, 4821] },
        monthly: { labels: ['-5m', '-4m', '-3m', '-2m', '-1m', 'This Month'], values: [7500, 7000, 6500, 6000, 5500, 4821] }
      }
    };

    let currentDataType = 'netWorth';
    let currentTimeframe = 'daily';

    const chartConfig = {
      type: 'line',
      data: {
        labels: sampleData[currentDataType][currentTimeframe].labels,
        datasets: [{
          label: 'Value',
          data: sampleData[currentDataType][currentTimeframe].values,
          borderColor: '#003169',
          backgroundColor: 'rgba(0, 49, 105, 0.1)',
          fill: true,
          tension: 0.3,
          pointBackgroundColor: '#003169',
          pointBorderColor: '#fff',
          pointHoverRadius: 7,
          pointHoverBackgroundColor: '#003169',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              color: '#a5a5a5ff', // Change this value to set the Y-axis text color
              callback: function(value) {
                if (currentDataType === 'netWorth') {
                  // Format the number with commas and show the full value
                  return `RFC ${(value * 1000).toLocaleString('en-US')}`;
                }
                return `#${value}`;
              }
            },
            grid: {
              color: 'rgba(0,0,0,0.05)'
            }
          },
          x: {
            ticks: {
              color: 'rgba(0, 0, 0, 0.7)', // You can also set the X-axis color here
            },
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  if (currentDataType === 'netWorth') {
                    label += `RFC ${context.parsed.y * 1000}`;
                  } else {
                    label += `#${context.parsed.y}`;
                  }
                }
                return label;
              }
            }
          }
        }
      }
    };

    const performanceChart = new Chart(ctx, chartConfig);

    const updateChart = () => {
      const newData = sampleData[currentDataType][currentTimeframe];
      performanceChart.data.labels = newData.labels;
      performanceChart.data.datasets[0].data = newData.values;
      performanceChart.options.scales.y.reverse = currentDataType === 'rank'; // Invert Y-axis for rank
      performanceChart.update();
    };

    document.querySelectorAll('.chart-toggle-btn, .time-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentDataType = btn.dataset.type || currentDataType;
        currentTimeframe = btn.dataset.time || currentTimeframe;
        
        document.querySelectorAll('.chart-toggle-btn, .time-toggle-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`.chart-toggle-btn[data-type="${currentDataType}"]`).classList.add('active');
        document.querySelector(`.time-toggle-btn[data-time="${currentTimeframe}"]`).classList.add('active');
        
        updateChart();
      });
    });
  }

  // FAQ Accordion Logic (Help Page)
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      question.addEventListener('click', () => {
        const wasActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active')); // Close all others
        if (!wasActive) item.classList.add('active'); // Open the clicked one if it wasn't already open
      });
    });
  }
});
