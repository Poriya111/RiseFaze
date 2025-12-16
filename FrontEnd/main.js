// Run this function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // --- Global UI setup based on login state ---
  const checkLoginState = () => {
    // In a real app, you'd check for a valid auth token
    const isLoggedIn = localStorage.getItem('authToken');

    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const nav = document.querySelector('header nav');

    if (isLoggedIn && nav) {
      // User is logged in, show dashboard button
      if (loginBtn) loginBtn.style.display = 'none';
      if (signupBtn) signupBtn.style.display = 'none';

      // Add "Go to Dashboard" button if it doesn't exist
      if (!document.getElementById('dashboardNavBtn')) {
        const dashboardBtn = document.createElement('a');
        dashboardBtn.href = 'dashboard.html';
        dashboardBtn.className = 'btn primary-btn';
        dashboardBtn.id = 'dashboardNavBtn';
        dashboardBtn.textContent = 'Go to Dashboard';
        nav.appendChild(dashboardBtn);
      }
    }
  };
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

  // Check login state on every page load to set the correct nav buttons
  checkLoginState();

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
    signupForm.addEventListener('submit', async function (e) {
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

      try {
        const response = await fetch('http://localhost:5001/api/users/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password: pw }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Something went wrong');
        }

        localStorage.setItem('authToken', data.token);
        window.location.href = 'dashboard.html';
      } catch (error) {
        alert(`Signup failed: ${error.message}`);
      }
    });
  }

  // Login form validation
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const email = this.email.value.trim();
      const pw = this.password.value;
      if (!email || !pw) {
        alert('Please fill all required fields.');
        return;
      }

      try {
        const response = await fetch('http://localhost:5001/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password: pw }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Something went wrong');
        }

        // Store the token and redirect
        localStorage.setItem('authToken', data.token);
        window.location.href = 'dashboard.html';
      } catch (error) {
        alert(`Login failed: ${error.message}`);
      }
    });
  }

  // Contact form submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = this.name.value.trim();
      const email = this.email.value.trim();
      const message = this.message.value.trim();
      if (!name || !email || !message) {
        alert('Please fill out all fields.');
        return;
      }
      alert('Thank you for your message! We will get back to you shortly.');
      this.reset(); // Clear the form
    });
  }

  // Create hidden buttons for pages that need them (signup, login)
  if (signupForm || loginForm) {
    const _hid = document.createElement('div');
    _hid.style.display = 'none';
    _hid.innerHTML = '<button id="getStartedBtn"></button><button id="seeDemoBtn"></button><button id="startJourneyBtn"></button>';
    document.body.appendChild(_hid);
  }

  // Logout Logic
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('authToken'); // Clear the token
      window.location.href = 'index.html'; // Redirect to home
    });
  }

  // Asset Modal Logic (Dashboard)
  const assetModal = document.getElementById('assetModal'); // Main declaration
  if (assetModal) {
    const closeModalBtn = assetModal.querySelector('.modal-close-btn');
 
    const closeModal = () => {
      assetModal.classList.remove('visible');
      document.body.classList.remove('popup-open');
    };
 
    closeModalBtn.addEventListener('click', closeModal);
    assetModal.addEventListener('click', (e) => {
      // Close if clicked on the overlay itself, not the content
      if (e.target === assetModal) {
        closeModal();
      }
    });
 
    // Use event delegation for "More" buttons on dynamically loaded assets
    document.addEventListener('click', (e) => {
      if (e.target && e.target.classList.contains('more-btn')) {
        const card = e.target.closest('.asset-card');
        if (!card) return;
 
        const name = card.dataset.name;
        const price = card.dataset.price;
        const icon = card.dataset.icon;
        const description = card.dataset.description;
 
        // Populate modal
        assetModal.querySelector('#modalAssetName').textContent = name;
        assetModal.querySelector('#modalAssetPrice').textContent = `RFC ${parseInt(price).toLocaleString()}`;
        assetModal.querySelector('.modal-asset-icon').textContent = icon;
        assetModal.querySelector('#modalAssetDescription').textContent = description;
 
        // Simulate calculating a bank buy price (e.g., 95% of market value)
        const bankPrice = parseFloat(price) * 0.95;
        assetModal.querySelector('#modalBankBuyPrice').textContent = `RFC ${bankPrice.toLocaleString()}`;
 
        // Show modal
        assetModal.classList.add('visible');
        document.body.classList.add('popup-open');
      }
    });
 
    // Add logic for the "Sell to Bank" button
    const sellAssetBtn = document.getElementById('sellAssetBtn');
    if (sellAssetBtn) {
      sellAssetBtn.addEventListener('click', () => {
        const assetName = assetModal.querySelector('#modalAssetName').textContent;
        // Find the corresponding asset card on the dashboard and remove it
        const assetCardToRemove = document.querySelector(`.asset-card[data-name="${assetName}"]`);
        if (assetCardToRemove) {
          assetCardToRemove.remove();
        }
        closeModal();
        alert(`'${assetName}' sold to the RiseFaze Bank! Your RFC balance has been updated.`);
        checkOwnedAssets(); // Re-check if the owned assets grid is now empty
      });
    }
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

    // Add overlay click to close for all modals
    if (popup.classList.contains('modal-overlay')) {
      popup.addEventListener('click', (e) => {
        if (e.target === popup) closeAllPopups();
      });
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

    // Display an empty state message until backend data is available
    contributionContainer.innerHTML = '<p class="loading-message">Loading activity data...</p>';
  }

  // Performance Graph Logic (Dashboard)
  const chartCanvas = document.getElementById('performanceChart');
  if (chartCanvas) {
    const ctx = chartCanvas.getContext('2d');

    // --- Sample Data (replace with actual data from backend) ---
    // const sampleData = {
    //   netWorth: {
    //     hourly: { labels: ['-5h', '-4h', '-3h', '-2h', '-1h', 'Now'], values: [1240, 1242, 1241, 1245, 1248, 1250] },
    //     daily: { labels: ['-6d', '-5d', '-4d', '-3d', '-2d', '-1d', 'Today'], values: [1190, 1200, 1210, 1205, 1220, 1230, 1250] },
    //     monthly: { labels: ['-5m', '-4m', '-3m', '-2m', '-1m', 'This Month'], values: [800, 950, 1000, 1100, 1150, 1250] }
    //   },
    //   rank: {
    //     hourly: { labels: ['-5h', '-4h', '-3h', '-2h', '-1h', 'Now'], values: [4825, 4824, 4826, 4822, 4820, 4821] },
    //     daily: { labels: ['-6d', '-5d', '-4d', '-3d', '-2d', '-1d', 'Today'], values: [5100, 5050, 4900, 4950, 4850, 4800, 4821] },
    //     monthly: { labels: ['-5m', '-4m', '-3m', '-2m', '-1m', 'This Month'], values: [7500, 7000, 6500, 6000, 5500, 4821] }
    //   }
    // };

    let currentDataType = 'netWorth';
    let currentTimeframe = 'daily';

    const chartConfig = {
      type: 'line',
      data: {
        labels: [], // sampleData[currentDataType][currentTimeframe].labels,
        datasets: [{
          label: 'Value',
          data: [], // sampleData[currentDataType][currentTimeframe].values,
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
      // This part will be populated by backend data. For now, it just clears the chart.
      // const newData = sampleData[currentDataType][currentTimeframe];
      // performanceChart.data.labels = newData.labels;
      // performanceChart.data.datasets[0].data = newData.values;
      performanceChart.data.labels = [];
      performanceChart.data.datasets[0].data = [];
      performanceChart.options.scales.y.reverse = currentDataType === 'rank';
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

  // --- Dynamic Data Population for Explore Page ---

  // Function to render assets in the marketplace
  const renderMarketplaceAssets = async () => {
    const assetsGrid = document.querySelector('.assets-grid');
    const loadingMessage = document.getElementById('assets-loading');
    if (!assetsGrid || !loadingMessage) return;

    try {
      const response = await fetch('http://localhost:5001/api/assets/explore');
      const bankAssets = await response.json();

      loadingMessage.style.display = 'none'; // Hide loading message

      if (bankAssets.length === 0) {
        assetsGrid.innerHTML = '<p class="empty-state-message">The RiseFaze Bank has no assets for sale at this time.</p>';
        return;
      }
      
      assetsGrid.innerHTML = ''; // Clear loading message
      bankAssets.forEach(asset => {
        const card = document.createElement('div');
        card.className = 'asset-card';
        // Add a data attribute for the asset ID for future use (e.g., buying)
        card.dataset.id = asset._id;
        card.innerHTML = `
          <div class="asset-icon">${asset.emoji}</div>
          <div class="asset-info">
            <h3>${asset.name}</h3>
            <p class="asset-price">RFC ${asset.price.toLocaleString()}</p>
          </div>
          <p class="asset-source">Sold by RiseFaze Assets Bank</p>
          <p class="asset-description">${asset.description}</p>
          <button class="btn primary-btn purchase-btn">Purchase Asset</button>
        `;
        assetsGrid.appendChild(card);
      });
    } catch (error) {
      loadingMessage.textContent = 'Failed to load assets. Please try again later.';
      console.error('Failed to fetch marketplace assets:', error);
    }
  };

  // Function to render the global leaderboard
  const renderLeaderboard = () => {
    const leaderboardList = document.querySelector('.leaderboard-list');
    const loadingMessage = document.getElementById('leaderboard-loading');
    if (!leaderboardList || !loadingMessage) return;

    // Mock data for the leaderboard
    // const leaderboardData = [
    //   { rank: 1, name: 'Alex Mercer', netWorth: 15200000 },
    //   { rank: 2, name: 'Jasmine Lee', netWorth: 12800000 },
    //   { rank: 3, name: 'Kenji Tanaka', netWorth: 11500000 },
    //   { rank: 4, name: 'Sofia Rossi', netWorth: 9800000 },
    //   { rank: 5, name: 'Ben Carter', netWorth: 9100000 }
    // ];
    const leaderboardData = []; // Default to empty

    // Simulate a network delay
    setTimeout(() => {
      loadingMessage.style.display = 'none'; // Hide loading message

      if (leaderboardData.length === 0) {
        leaderboardList.innerHTML = '<p class="empty-state-message">Leaderboard data is currently unavailable.</p>';
        return;
      }

      leaderboardData.forEach(user => {
        const item = document.createElement('li');
        item.className = 'leaderboard-item';
        item.innerHTML = `
          <span class="rank">${user.rank}</span>
          <span class="user-name">${user.name}</span>
          <span class="net-worth">RFC ${user.netWorth.toLocaleString()}</span>
        `;
        leaderboardList.appendChild(item);
      });
    }, 1000); // 1 second delay
  };

  // --- Dynamic Data Population for Dashboard Page ---

  // Function to handle empty state for owned assets
  const checkOwnedAssets = () => {
    const assetsContainer = document.querySelector('.owned-assets-container');
    if (!assetsContainer) return;

    const grid = assetsContainer.querySelector('.owned-assets-grid');
    const exploreBtn = assetsContainer.querySelector('#exploreAssetsBtn');

    // Check if there are any .asset-card elements left.
    if (grid.children.length === 0) {
      grid.innerHTML = '<p class="empty-state-message">You do not own any assets yet. Visit the explore page to start building your empire!</p>';
      // Optional: Make the explore button more prominent
      exploreBtn.style.marginTop = '20px';
    }
  };

  // Function to populate dashboard with mock data
  const renderDashboardData = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // If no token, redirect to login page
      window.location.href = 'login.html';
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        // If token is invalid, remove it and redirect
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
        return;
      }

      const userData = await response.json();

      // Populate KPIs
      document.getElementById('username-placeholder').textContent = userData.username;
      document.getElementById('kpi-net-worth').textContent = `RFC ${userData.netWorth.toLocaleString()}`;
      document.getElementById('kpi-rfc-balance').textContent = `RFC ${userData.rfcBalance.toLocaleString()}`;
      
      // Populate Owned Assets
      const ownedAssetsGrid = document.querySelector('.owned-assets-grid');
      ownedAssetsGrid.innerHTML = ''; // Clear any existing content

      if (userData.ownedAssets && userData.ownedAssets.length > 0) {
        document.getElementById('kpi-assets-owned').textContent = userData.ownedAssets.length;

        userData.ownedAssets.forEach(asset => {
          const card = document.createElement('div');
          card.className = 'asset-card owned-asset';
          card.dataset.id = asset._id; // Use asset ID for reliability
          card.dataset.name = asset.name;
          card.dataset.price = asset.price;
          card.dataset.icon = asset.emoji;
          card.dataset.description = asset.description;
          card.innerHTML = `
            <div class="asset-icon">${asset.emoji}</div>
            <div class="asset-info">
              <h3>${asset.name}</h3>
              <p class="asset-price">Value: RFC ${asset.price.toLocaleString()}</p>
            </div>
            <button class="btn more-btn">More</button>
          `;
          ownedAssetsGrid.appendChild(card);
        });
      }

      checkOwnedAssets();

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Optionally show an error message to the user
    }
  };

  // --- Initialize Page-Specific Logic ---

  // Run logic for the explore page
  if (document.querySelector('.assets-container')) {
    renderMarketplaceAssets();
    renderLeaderboard();
  }

  // Run logic for the dashboard page
  if (document.querySelector('.dashboard-container')) {
    renderDashboardData();
  }
});
