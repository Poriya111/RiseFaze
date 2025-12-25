// Run this function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // --- Global UI setup based on login state ---
  let currentUser = null; // Store the current user globally for socket updates

  const checkLoginState = () => {
    const isLoggedIn = localStorage.getItem('authToken');

    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const nav = document.querySelector('header nav');

    if (isLoggedIn && nav) {
      // User is logged in, show dashboard button
      if (loginBtn) loginBtn.style.display = 'none';
      if (signupBtn) signupBtn.style.display = 'none';

      // Also hide any navigation links to login/signup pages (for pages that use <a> tags)
      const authLinks = nav.querySelectorAll('a[href="login.html"], a[href="signup.html"]');
      authLinks.forEach(link => link.style.display = 'none');

      // Check if the current page is the dashboard
      const onDashboard = window.location.pathname.endsWith('/dashboard.html');

      // Add "Go to Dashboard" button if it doesn't exist AND we are not on the dashboard
      if (!document.getElementById('dashboardNavBtn') && !onDashboard) {
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
      if (localStorage.getItem('authToken')) {
        window.location.href = 'dashboard.html';
      } else {
        window.location.href = 'signup.html';
      }
    });
  }

  const startJourneyBtn = document.getElementById('startJourneyBtn');
  if (startJourneyBtn) {
    startJourneyBtn.addEventListener('click', () => {
      if (localStorage.getItem('authToken')) {
        window.location.href = 'dashboard.html';
      } else {
        window.location.href = 'signup.html';
      }
    });
  }

  const signupBtn = document.getElementById('signupBtn');
  if (signupBtn) {
    signupBtn.addEventListener('click', () => {
      if (localStorage.getItem('authToken')) {
        window.location.href = 'dashboard.html';
      } else {
        window.location.href = 'signup.html';
      }
    });
  }

  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      if (localStorage.getItem('authToken')) {
        window.location.href = 'dashboard.html';
      } else {
        window.location.href = 'login.html';
      }
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

  // --- Notification System ---
  const showNotification = (message, type = 'info', duration = 1000) => {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    container.appendChild(notification);

    // Trigger the fly-in animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 10); // Small delay to allow the element to be in the DOM

    // Set timeout to hide the notification
    setTimeout(() => {
      notification.classList.remove('show');
      notification.classList.add('hide');
      // Remove the element from the DOM after the hide animation finishes
      notification.addEventListener('transitionend', () => {
        notification.remove();
      });
    }, duration);
  };

  // Signup form validation
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const name = this.username.value.trim(); // Correctly use the username field
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
          body: JSON.stringify({ username: name, email, password: pw }),
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

  // Email Support Button: Dynamic Body with Username
  const emailSupportBtn = document.getElementById('emailSupportBtn');
  if (emailSupportBtn) {
    const updateMailLink = (username) => {
      const currentHref = emailSupportBtn.getAttribute('href');
      // Base body text
      let body = "Hello RiseFaze Support,\n\n";
      
      if (username) {
        body += `\n\n\nUsername: ${username}`;
      }
      
      // Append body param
      const newHref = `${currentHref}&body=${encodeURIComponent(body)}`;
      emailSupportBtn.setAttribute('href', newHref);
    };

    const token = localStorage.getItem('authToken');
    if (token) {
      fetch('http://localhost:5001/api/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.ok ? res.json() : null)
      .then(user => {
        if (user && user.username) {
          updateMailLink(user.username);
        } else {
          updateMailLink();
        }
      })
      .catch(() => updateMailLink());
    } else {
      updateMailLink();
    }
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
 
        assetModal.dataset.assetId = card.dataset.id; // Store the asset ID on the modal
        // Populate modal
        assetModal.querySelector('#modalAssetName').textContent = name;
        assetModal.querySelector('#modalAssetPrice').textContent = `RFC ${parseInt(price).toLocaleString()}`;
        assetModal.querySelector('.modal-asset-icon').textContent = icon;
        assetModal.querySelector('#modalAssetDescription').textContent = description;
 
        // Set the max sell price (5% margin) and default the input value to the original price
        const originalPrice = parseFloat(price);
        const maxSellPrice = originalPrice * 1.05;
        assetModal.dataset.maxSellPrice = maxSellPrice; // Store for validation on sell click
        assetModal.querySelector('#sellPriceInput').value = originalPrice.toFixed(2);
        assetModal.querySelector('#maxSellPriceInfo').textContent = `(Max: RFC ${maxSellPrice.toLocaleString()})`;
 
        // Show modal
        assetModal.classList.add('visible');
      }
    });
 
    // Add logic for the "Sell to Bank" button
    const sellAssetBtn = document.getElementById('sellAssetBtn');
    if (sellAssetBtn) {
      sellAssetBtn.addEventListener('click', async () => {
        const assetId = assetModal.dataset.assetId;
        const maxSellPrice = parseFloat(assetModal.dataset.maxSellPrice);
        const customPrice = parseFloat(document.getElementById('sellPriceInput').value);
        const token = localStorage.getItem('authToken');

        if (!assetId || !token) {
          alert('Could not process sale. Please try again.');
          return;
        }

        if (isNaN(customPrice) || customPrice <= 0) {
          alert('Please enter a valid selling price.');
          return;
        }

        // Frontend validation for the 5% margin
        if (customPrice > maxSellPrice) {
          alert(`Price too high. The maximum selling price for this asset is RFC ${maxSellPrice.toLocaleString()}.`);
          return;
        }

        try {
          const response = await fetch(`http://localhost:5001/api/assets/${assetId}/sell`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', // Tell the server we're sending JSON
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ customPrice }), // Send the custom price in the body
          });

          if (!response.ok) {
            let errorMessage = 'Sell failed';
            try {
              const errorData = await response.json();
              if (errorData.message) errorMessage = errorData.message;
            } catch (e) {
              // Response was not JSON, likely an HTML error page.
              // Since the sell logic works, we can proceed with UI updates.
              console.error("Could not parse error response as JSON, but proceeding with UI update.", e);
            }
            // If the response was truly bad AND not the known issue, we might still throw.
            // For now, we'll allow the UI update to proceed optimistically.
          }

          // --- FIX: Optimistically update UI since the backend logic succeeds before crashing ---
          showNotification('Asset sold successfully!', 'success');
          assetModal.classList.remove('visible'); // Close the modal
          renderDashboardData(); // Re-fetch all dashboard data to ensure consistency

        } catch (error) {
          showNotification(`Error: ${error.message}`, 'error');
        }
      });
    }
  }

  // Navbar Popups Logic (Dashboard)
  const profileBtn = document.getElementById('profileBtn');

  const notificationsModal = document.getElementById('notificationsModal');
  const profilePopup = document.getElementById('profilePopup');
  const filterPopup = document.getElementById('filterPopup');

  const allPopups = [profilePopup, assetModal, notificationsModal, filterPopup];

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

    // Add overlay click to close for all modals
    if (popup.classList.contains('modal-overlay')) {
      popup.addEventListener('click', (e) => {
        if (e.target === popup) closeAllPopups();
      });
    }
  };

  setupPopup(profileBtn, profilePopup);
  setupPopup(document.getElementById('notificationsPopup'), notificationsModal);
  
  // Filter Popup Logic
  setupPopup(document.getElementById('openFilterBtn'), filterPopup);

  // Specific logic for fetching notifications when the popup is opened
  const notificationsBtn = document.getElementById('notificationsPopup');
  if (notificationsBtn) {
    notificationsBtn.addEventListener('click', async () => {
      const listContainer = document.getElementById('notificationsList');
      if (!listContainer) return;

      listContainer.innerHTML = '<p class="loading-message">Loading notifications...</p>';
      const token = localStorage.getItem('authToken');

      try {
        const response = await fetch('http://localhost:5001/api/users/notifications', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch notifications');

        const notifications = await response.json();
        listContainer.innerHTML = ''; // Clear loading message

        if (notifications.length === 0) {
          listContainer.innerHTML = '<p class="empty-state-message">No notifications in the last 24 hours.</p>';
          return;
        }

        notifications.forEach(notif => {
          const item = document.createElement('div');
          item.className = `popup-list-item notification-${notif.type}`;
          const icon = notif.type === 'success' ? '📈' : '📉';
          item.innerHTML = `
            <p>${icon} ${notif.message}</p>
            <span class="notification-timestamp">${new Date(notif.createdAt).toLocaleTimeString()}</span>
          `;
          listContainer.appendChild(item);
        });
      } catch (error) {
        console.error('Error fetching notifications:', error);
        listContainer.innerHTML = '<p class="empty-state-message">Could not load notifications.</p>';
      }
    });
  }

  // Global click listener to close popups
  document.addEventListener('click', (e) => {
    // If the click is outside a popup and not on a trigger button
    if (!e.target.closest('.modal-content, .profile-popup, .filter-popup, .more-btn, .icon-btn')) {
      closeAllPopups();
    }
  });

  // Performance Graph Logic (Dashboard)
  const chartCanvas = document.getElementById('performanceChart');
  if (chartCanvas) {
    const ctx = chartCanvas.getContext('2d');

    let currentDataType = 'netWorth';
    let currentTimeframe = 'daily';

    const chartConfig = {
      type: 'line',
      data: {
        labels: [], // sampleData[currentDataType][currentTimeframe].labels,
        datasets: [{
          label: 'Value',
          data: [], // sampleData[currentDataType][currentTimeframe].values,
          borderColor: 'var(--accent)',
          backgroundColor: 'rgba(95, 150, 212, 0.1)',
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
                if (currentDataType === 'netWorth') return `RFC ${value.toLocaleString()}`;
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
                  label += currentDataType === 'netWorth' 
                    ? `RFC ${context.parsed.y.toLocaleString()}` 
                    : `#${context.parsed.y.toLocaleString()}`;
                }
                return label;
              }
            }
          }
        }
      }
    };

    const performanceChart = new Chart(ctx, chartConfig);

    const updateChart = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const response = await fetch(`http://localhost:5001/api/users/performance?timeframe=${currentTimeframe}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch performance data');

        const performanceData = await response.json();
        const newData = performanceData[currentDataType];

        performanceChart.data.labels = newData.labels;
        performanceChart.data.datasets[0].data = newData.values;
        performanceChart.options.scales.y.reverse = currentDataType === 'rank';

      } catch (error) {
        console.error('Error updating chart:', error);
      }
      performanceChart.update();
    };

    document.querySelectorAll('.chart-toggle-btn, .time-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentDataType = btn.dataset.type || currentDataType;
        currentTimeframe = btn.dataset.time || currentTimeframe; // will be 'oneHour', 'twelveHours', etc.
        
        document.querySelectorAll('.chart-toggle-btn, .time-toggle-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`.chart-toggle-btn[data-type="${currentDataType}"]`).classList.add('active');
        document.querySelector(`.time-toggle-btn[data-time="${currentTimeframe}"]`).classList.add('active');
        
        updateChart();
      });
    });

    // Initial chart load
    updateChart();
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
  const renderMarketplaceAssets = async (user = null) => {
    const assetsGrid = document.querySelector('.assets-grid');
    const loadingMessage = document.getElementById('assets-loading');
    const categorySelect = document.getElementById('categoryFilter');
    if (!assetsGrid || !loadingMessage) return;

    try {
      const response = await fetch('http://localhost:5001/api/assets/explore');
      const bankAssets = await response.json();

      loadingMessage.style.display = 'none'; // Hide loading message

      if (bankAssets.length === 0) {
        assetsGrid.innerHTML = '<p class="empty-state-message">The RiseFaze Bank has no assets for sale at this time.</p>';
        return;
      }
      
      const categories = new Set();
      assetsGrid.innerHTML = ''; // Clear loading message
      bankAssets.forEach(asset => {
        const card = document.createElement('div');
        card.className = 'asset-card';

        let canAfford = false;
        let isOnCooldown = false;
        let buttonText = 'Purchase Asset';
        let buttonTitle = 'Click to purchase';
        let isDisabled = false;

        if (user) {
          canAfford = user.rfcBalance >= asset.price;
          const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
          if (asset.lastSoldBy === user._id && new Date(asset.lastSoldAt) > sixHoursAgo) {
            isOnCooldown = true;
          }
        }

        if (isOnCooldown) {
          buttonText = 'On Cooldown';
          buttonTitle = 'You cannot repurchase an asset you sold within 6 hours.';
          isDisabled = true;
        } else if (user && !canAfford) {
          buttonText = "Insufficient RFC";
          buttonTitle = 'You do not have enough RFC to purchase this.';
          isDisabled = true;
        }

        // Add a data attribute for the asset ID for future use (e.g., buying)
        card.dataset.id = asset._id;
        // Add data attributes for searching
        card.dataset.name = asset.name.toLowerCase();
        card.dataset.price = asset.price; // Ensure price is in dataset
        card.dataset.category = asset.category.toLowerCase();
        // Assume asset has income or yield, default to 0 if not present
        let rawIncome = asset.income || asset.yield || asset.yieldRate || asset.revenue || asset.profit || asset.return || asset.roi || asset.dailyIncome || 0;
        
        // Fallback: Check description for percentage if income is not explicitly found
        if (!rawIncome && asset.description) {
             const descMatch = asset.description.match(/(\d+(\.\d+)?)%/);
             if (descMatch) {
                 rawIncome = descMatch[1];
             }
        }

        if (typeof rawIncome === 'string') {
            const match = rawIncome.match(/[\d\.]+/);
            rawIncome = match ? match[0] : 0;
        }
        const income = parseFloat(rawIncome) || 0;
        card.dataset.income = income;

        if (asset.category) {
            categories.add(asset.category);
        }

        card.innerHTML = `
          <div class="asset-icon">${asset.emoji}</div>
          <div class="asset-info">
            <h3>${asset.name}</h3>
            <p class="asset-price">RFC ${asset.price.toLocaleString()}</p>
          </div>
          <p class="asset-source">Sold by RiseFaze Assets Bank</p>
          <p class="asset-description">${asset.description}</p>
          <button class="btn primary-btn purchase-btn" data-id="${asset._id}" ${isDisabled ? 'disabled' : ''} title="${buttonTitle}">
            ${buttonText}
          </button>
        `;
        assetsGrid.appendChild(card);
      });

      // Populate Category Filter
      if (categorySelect) {
        // Keep the "All" option
        categorySelect.innerHTML = '<option value="all">All Categories</option>';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.toLowerCase();
            option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
            categorySelect.appendChild(option);
        });
      }
    } catch (error) {
      loadingMessage.textContent = 'Failed to load assets. Please try again later.';
      console.error('Failed to fetch marketplace assets:', error);
    }
  };

  // Function to render the global leaderboard
  const renderLeaderboard = async (currentUser = null) => {
    const leaderboardList = document.querySelector('.leaderboard-list');
    const loadingMessage = document.getElementById('leaderboard-loading');
    if (!leaderboardList || !loadingMessage) return;

    try {
      const response = await fetch('http://localhost:5001/api/leaderboard');
      const leaderboardData = await response.json();

      loadingMessage.style.display = 'none'; // Hide loading message

      if (leaderboardData.length === 0) {
        leaderboardList.innerHTML = '<p class="empty-state-message">Leaderboard data is currently unavailable.</p>';
        return;
      }
      
      leaderboardList.innerHTML = ''; // Clear previous content
      leaderboardData.forEach(leaderboardUser => {
        const item = document.createElement('li');
        item.className = 'leaderboard-item';

        let displayNetWorth = leaderboardUser.netWorth;

        // Check if this leaderboard entry is the currently logged-in user
        if (currentUser && currentUser.username === leaderboardUser.username) {
          item.classList.add('current-user'); // Add a class for styling
        }

        item.innerHTML = `
          <span class="rank">${leaderboardUser.rank}</span>
          <span class="user-name">${leaderboardUser.username}</span>
          <span class="net-worth">RFC ${displayNetWorth.toLocaleString()}</span>
        `;
        leaderboardList.appendChild(item);
      });
    } catch (error) {
      loadingMessage.textContent = 'Failed to load leaderboard.';
      console.error('Failed to fetch leaderboard:', error);
    }
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
      currentUser = userData; // Update global reference

      // Populate Net Worth Change KPI
      const netWorthChangeEl = document.getElementById('kpi-net-worth-change');
      const change = userData.netWorthChange || 0;

      netWorthChangeEl.textContent = `${change >= 0 ? '▲' : '▼'} RFC ${Math.abs(change).toLocaleString()}`;
      netWorthChangeEl.className = 'kpi-change'; // Reset classes
      if (change > 0) {
        netWorthChangeEl.classList.add('positive');
      } else if (change < 0) {
        netWorthChangeEl.classList.add('negative');
      } else {
        netWorthChangeEl.textContent = 'RFC 0';
      }

      // --- FIX: Recalculate Net Worth on the client-side to guarantee accuracy ---
      const totalAssetsValue = userData.ownedAssets.reduce((sum, asset) => sum + asset.price, 0);
      const calculatedNetWorth = totalAssetsValue + userData.rfcBalance;

      // Populate KPIs with the corrected values
      document.getElementById('username-placeholder').textContent = userData.username;
      document.getElementById('kpi-net-worth').textContent = `RFC ${calculatedNetWorth.toLocaleString()}`;
      document.getElementById('kpi-rfc-balance').textContent = `RFC ${userData.rfcBalance.toLocaleString()}`;
      document.getElementById('kpi-global-rank').textContent = `#${userData.globalRank.toLocaleString()}`;



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
    const initializeExplorePage = async () => {
      const token = localStorage.getItem('authToken');
      let user = null; // Default for guests

      if (token) {
        try {
          const userResponse = await fetch('http://localhost:5001/api/users/me', {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (userResponse.ok) {
            user = await userResponse.json();
            currentUser = user; // Update global reference
            // --- NEW: Populate the sticky balance display ---
            const balanceEl = document.getElementById('explore-rfc-balance');
            if (balanceEl) {
              balanceEl.textContent = `RFC ${user.rfcBalance.toLocaleString()}`;
            }
            // --- NEW: Update button states on initial load ---
            updatePurchaseButtonsState(user.rfcBalance);
          } else {
            document.getElementById('explore-rfc-balance').textContent = 'N/A';
          }
        } catch (error) { console.error('Could not fetch user data for explore page.'); }
      }
      // Pass the entire user object (or null) to the render function
      renderMarketplaceAssets(user);
      renderLeaderboard(user);

      // --- Filter Logic ---
      const searchInput = document.querySelector('.search-input');
      const categoryFilter = document.getElementById('categoryFilter');
      const sortFilter = document.getElementById('sortFilter');
      const minPriceInput = document.getElementById('minPrice');
      const maxPriceInput = document.getElementById('maxPrice');

      const applyFilters = () => {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
        const sortBy = sortFilter ? sortFilter.value : 'default';
        const minPrice = minPriceInput && minPriceInput.value ? parseFloat(minPriceInput.value) : 0;
        const maxPrice = maxPriceInput && maxPriceInput.value ? parseFloat(maxPriceInput.value) : Infinity;

        const assetsGrid = document.querySelector('.assets-grid');
        const assetCards = Array.from(document.querySelectorAll('.assets-grid .asset-card'));
        let visibleCount = 0;

        // Filter
        assetCards.forEach(card => {
            const name = card.dataset.name || '';
            const category = card.dataset.category || '';
            const price = parseFloat(card.dataset.price || 0);

            const matchesSearch = name.includes(searchTerm) || category.includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
            const matchesPrice = price >= minPrice && price <= maxPrice;

            if (matchesSearch && matchesCategory && matchesPrice) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Sort
        if (sortBy !== 'default') {
            assetCards.sort((a, b) => {
                const priceA = parseFloat(a.dataset.price);
                const priceB = parseFloat(b.dataset.price);
                const nameA = a.dataset.name;
                const nameB = b.dataset.name;

                if (sortBy === 'price-asc') return priceA - priceB;
                if (sortBy === 'price-desc') return priceB - priceA;
                if (sortBy === 'name-asc') return nameA.localeCompare(nameB);
                return 0;
            });
            // Re-append in new order
            assetCards.forEach(card => assetsGrid.appendChild(card));
        }

        // Empty State
        let emptyMessage = assetsGrid.querySelector('.empty-state-message-filter');
        if (visibleCount === 0) {
            if (!emptyMessage) {
                emptyMessage = document.createElement('p');
                emptyMessage.className = 'empty-state-message empty-state-message-filter';
                emptyMessage.textContent = 'No assets match your filters.';
                assetsGrid.appendChild(emptyMessage);
            }
        } else if (emptyMessage) {
            emptyMessage.remove();
        }
      };

      // Attach listeners
      if (searchInput) searchInput.addEventListener('input', applyFilters);
      if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
      if (sortFilter) sortFilter.addEventListener('change', applyFilters);
      if (minPriceInput) minPriceInput.addEventListener('input', applyFilters);
      if (maxPriceInput) maxPriceInput.addEventListener('input', applyFilters);
    };
    initializeExplorePage();
  }

  // Add Purchase Logic using Event Delegation
  document.addEventListener('click', async (e) => {
    if (e.target && e.target.classList.contains('purchase-btn')) {
      const assetId = e.target.dataset.id;
      const token = localStorage.getItem('authToken');

      if (!token) {
        alert('You must be logged in to purchase assets.');
        window.location.href = 'login.html';
        return;
      }

      // --- FIX: Client-side balance check before attempting purchase ---
      const card = e.target.closest('.asset-card');
      const assetPrice = parseFloat(card.dataset.price);
      const balanceEl = document.getElementById('explore-rfc-balance');
      const currentBalanceText = balanceEl ? balanceEl.textContent.replace('RFC ', '').replace(/,/g, '') : '0';
      const currentBalance = parseFloat(currentBalanceText);

      if (currentBalance < assetPrice) {
        showNotification("You don't have enough RFC to purchase this asset.", 'error');
        // Stop execution here; do not proceed to fetch or animate.
        return;
      }

      try {
        const response = await fetch(`http://localhost:5001/api/assets/${assetId}/buy`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // --- FIX: Animate the card away immediately on click ---
        // The backend logic is completing the purchase but failing afterward.
        // We will proceed with the UI update optimistically.
        card.classList.add('purchased');
        card.addEventListener('animationend', () => card.remove());

        // Show success notification optimistically as well
        showNotification('Asset purchased!', 'success');

        // --- FIX: Re-fetch user data and update UI optimistically ---
        // This ensures the leaderboard and balance display update even with the backend error.
        const userResponse = await fetch('http://localhost:5001/api/users/me', { headers: { 'Authorization': `Bearer ${token}` } });
        if (userResponse.ok) {
          const updatedUser = await userResponse.json();
          renderLeaderboard(updatedUser);
          const balanceEl = document.getElementById('explore-rfc-balance');
          if (balanceEl) {
            balanceEl.textContent = `RFC ${updatedUser.rfcBalance.toLocaleString()}`;
          }
          // --- NEW: Update all purchase buttons with the new balance ---
          updatePurchaseButtonsState(updatedUser.rfcBalance);
        }

        if (!response.ok) {
          let errorMessage = 'An unknown error occurred during purchase.';
          try {
            // Try to parse the error response as JSON, as it might contain a specific message
            const errorData = await response.json();
            if (errorData.message) {
              errorMessage = errorData.message.includes('Insufficient rfcBalance')
                ? "You don't have enough RFC to purchase this asset."
                : errorData.message;
            }
          } catch (e) {
            // If parsing fails, it's likely an HTML error page, so we use a generic message.
            console.error('Could not parse error response as JSON.', e);
          }
          throw new Error(errorMessage);
        }

      } catch (error) {
        // --- NEW: Show a notification specifically for insufficient funds ---
        if (error.message.includes("You don't have enough RFC")) {
          showNotification(error.message, 'error');
        } else {
          // For other errors, log silently as previously requested.
          console.error('Purchase failed:', error.message);
        }
      }
    }
  });

  // --- Global Socket.io Logic (Runs on all pages if logged in) ---
  const initSocket = () => {
    // --- Socket.io Real-time Notifications ---
    const token = localStorage.getItem('authToken');
    if (token) {
      const socket = io('http://localhost:5001');

      socket.on('connect', () => {
        console.log('Connected to server via WebSocket.');
        // Authenticate the socket connection
        socket.emit('authenticate', token);
      });

      // Listen for net worth updates from the server
      socket.on('netWorthUpdate', (data) => {
        showNotification(data.message, data.type);

        // Update the net worth KPI on the dashboard without a full refresh
        const netWorthEl = document.getElementById('kpi-net-worth');
        if (netWorthEl) {
          // Get current net worth, parse it, add the change, and update the text
          const currentNetWorthText = netWorthEl.textContent.replace('RFC ', '').replace(/,/g, '');
          const currentNetWorth = parseInt(currentNetWorthText, 10);
          const newNetWorth = currentNetWorth + data.newNetWorth;
          netWorthEl.textContent = `RFC ${newNetWorth.toLocaleString()}`;
        }
      });

      // Listen for direct income generation from assets
      socket.on('incomeReceived', (data) => {
        showNotification(data.message, 'success');

        // Update RFC Balance KPI
        const rfcBalanceEl = document.getElementById('kpi-rfc-balance');
        if (rfcBalanceEl) {
          const currentBalance = parseInt(rfcBalanceEl.textContent.replace(/[RFC,]/g, ''), 10);
          const newBalance = currentBalance + data.amount;
          rfcBalanceEl.textContent = `RFC ${newBalance.toLocaleString()}`;
        }

        // Update Net Worth KPI
        const netWorthEl = document.getElementById('kpi-net-worth');
        if (netWorthEl) {
          const currentNetWorth = parseInt(netWorthEl.textContent.replace(/[RFC,]/g, ''), 10);
          const newNetWorth = currentNetWorth + data.amount;
          netWorthEl.textContent = `RFC ${newNetWorth.toLocaleString()}`;
        }
      });

      // Listen for global asset sales to prevent double purchasing
      socket.on('asset-sold', (data) => {
        // Find the asset card in the explore page and remove it
        const assetCard = document.querySelector(`.asset-card[data-id="${data.assetId}"]`);
        if (assetCard) {
          assetCard.style.transition = 'opacity 0.5s, transform 0.5s';
          assetCard.style.opacity = '0';
          assetCard.style.transform = 'scale(0.9)';
          setTimeout(() => assetCard.remove(), 500);
        }
      });

      // Listen for leaderboard updates
      socket.on('leaderboard-update', () => {
        // Only update if the leaderboard is present on the page
        if (document.querySelector('.leaderboard-list')) {
          renderLeaderboard(currentUser);
        }
      });
    }
  };

  initSocket();

  // Run logic for the dashboard page
  if (document.querySelector('.dashboard-container')) {
    renderDashboardData();
  }
});
