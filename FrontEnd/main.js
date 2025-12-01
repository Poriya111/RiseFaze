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
      // Simulate successful account creation and redirect
      alert('Account created! Redirecting to your new dashboard...');
      window.location.href = 'dashboard.html';
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
      // Simulate successful login and redirect
      alert('Signing in! Redirecting to your dashboard...');
      window.location.href = 'dashboard.html';
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

        // Simulate calculating a bank buy price (e.g., 95% of market value)
        const bankPrice = parseFloat(price.replace('RFC ', '').replace(/,/g, '')) * 0.95;
        assetModal.querySelector('#modalBankBuyPrice').textContent = `RFC ${bankPrice.toLocaleString()}`;

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
  const renderMarketplaceAssets = () => {
    const assetsGrid = document.querySelector('.assets-grid');
    const loadingMessage = document.getElementById('assets-loading');
    if (!assetsGrid || !loadingMessage) return;

    // Mock data for assets sold by the bank
    // const bankAssets = [
    //   { icon: '🏢', name: 'Downtown Office Block', price: 500000, description: 'A prime piece of commercial real estate generating steady passive income.' },
    //   { icon: '🎨', name: 'Digital Art NFT', price: 120000, description: 'A unique piece of digital art whose value fluctuates with market trends.' },
    //   { icon: '📈', name: 'Tech Startup Shares', price: 300000, description: 'Equity in a promising tech startup with high growth potential.' },
    //   { icon: '🚢', name: 'Shipping Port', price: 1200000, description: 'A major logistics hub that generates income from global trade.' },
    //   { icon: '⚡️', name: 'Solar Farm', price: 750000, description: 'A renewable energy asset providing consistent RFC returns.' }
    // ];
    const bankAssets = []; // Default to empty

    // Simulate a network delay
    setTimeout(() => {
      loadingMessage.style.display = 'none'; // Hide loading message

      if (bankAssets.length === 0) {
        assetsGrid.innerHTML = '<p class="empty-state-message">The RiseFaze Bank has no assets for sale at this time.</p>';
        return;
      }

      bankAssets.forEach(asset => {
        const card = document.createElement('div');
        card.className = 'asset-card';
        card.innerHTML = `
          <div class="asset-icon">${asset.icon}</div>
          <div class="asset-info">
            <h3>${asset.name}</h3>
            <p class="asset-price">RFC ${asset.price.toLocaleString()}</p>
          </div>
          <p class="asset-source">Sold by RiseFaze Assets Bank</p>
          <p class="asset-description">${asset.description}</p>
          <button class="btn primary-btn">Purchase Asset</button>
        `;
        assetsGrid.appendChild(card);
      });
    }, 1500); // 1.5 second delay to show the loading message
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
  const renderDashboardData = () => {
    // Mock data that would come from a backend API
    // const userData = {
    //   username: 'Poriya',
    //   netWorth: 1250000,
    //   netWorthChange: 50000,
    //   rfcBalance: 75000,
    //   assetsOwned: 3,
    //   globalRank: 4821,
    //   globalRankChange: -125,
    //   ownedAssets: [
    //     { name: 'Downtown Office Block', price: 500000, icon: '🏢', description: 'A prime piece of commercial real estate generating steady passive income.' },
    //     { name: 'Luxury Sports Car', price: 250000, icon: '🚗', description: 'A high-performance vehicle that increases your influence and status.' },
    //     { name: 'Suburban Residence', price: 180000, icon: '🏠', description: 'A comfortable home that provides a stable base for your empire.' }
    //   ]
    // };

    // The code below would be used to populate the DOM once `userData` is fetched from the backend.
    // For now, it's commented out to ensure the page loads empty.

    // if (userData) {
    //   // Populate KPIs
    //   document.getElementById('username-placeholder').textContent = userData.username;
    //   document.getElementById('kpi-net-worth').textContent = `RFC ${userData.netWorth.toLocaleString()}`;
    //   document.getElementById('kpi-net-worth-change').textContent = `+RFC ${userData.netWorthChange.toLocaleString()} (7d)`;
    //   document.getElementById('kpi-net-worth-change').classList.add('positive');
    //   document.getElementById('kpi-rfc-balance').textContent = `RFC ${userData.rfcBalance.toLocaleString()}`;
    //   document.getElementById('kpi-assets-owned').textContent = userData.assetsOwned;
    //   document.getElementById('kpi-global-rank').textContent = `#${userData.globalRank.toLocaleString()}`;
    //   document.getElementById('kpi-global-rank-change').textContent = `${userData.globalRankChange.toLocaleString()} (24h)`;
    //   document.getElementById('kpi-global-rank-change').classList.add('negative');

    //   // Populate Owned Assets
    //   const ownedAssetsGrid = document.querySelector('.owned-assets-grid');
    //   userData.ownedAssets.forEach(asset => {
    //     const card = document.createElement('div');
    //     card.className = 'asset-card owned-asset';
    //     card.dataset.name = asset.name;
    //     card.dataset.price = `RFC ${asset.price.toLocaleString()}`;
    //     card.dataset.icon = asset.icon;
    //     card.dataset.description = asset.description;
    //     card.innerHTML = `
    //       <div class="asset-icon">${asset.icon}</div>
    //       <div class="asset-info">
    //         <h3>${asset.name}</h3>
    //         <p class="asset-price">Value: RFC ${asset.price.toLocaleString()}</p>
    //       </div>
    //       <button class="btn more-btn">More</button>
    //     `;
    //     ownedAssetsGrid.appendChild(card);
    //   });
    // }

    // Re-initialize event listeners for the newly created "More" buttons
    initializeAssetModalLogic();
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
    checkOwnedAssets();
  }
});
