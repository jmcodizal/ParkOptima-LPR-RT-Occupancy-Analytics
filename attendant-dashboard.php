<?php
require_once 'db.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Attendant Dashboard | ParkOptima</title>
  <link rel="stylesheet" href="style.css" />
  <style>
    .status-badge { padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; }
    .status-pending { background: #fff7ed; color: #c2410c; border: 1px solid #ffedd5; }
    .traffic-badge { padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 800; text-transform: uppercase; }
    .traffic-low { background: #d1fae5; color: #065f46; }
    .vehicle-card { display: flex; flex-direction: column; gap: 8px; border: 1px solid #e2e8f0; padding: 16px; border-radius: 16px; background: #fff; }
    .vehicle-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-top: 20px; }
    .search-row { display: flex; gap: 12px; margin: 20px 0; align-items: center; }
    .search-input { flex: 1; padding: 12px 16px; border-radius: 12px; border: 1px solid #d9e2ef; }
    .filter-select { padding: 12px; border-radius: 12px; border: 1px solid #d9e2ef; background: #fff; min-width: 140px; }
    .btn-teal-outline { background: #06b6d4; color: #fff; padding: 12px 20px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; }
  </style>
</head>
<body>
  <div class="dashboard-shell">
    <aside class="sidebar">
      <div class="sidebar-brand">
        <img src="logo.png" alt="Logo" class="sidebar-logo" />
        <span class="brand-label">ParkOptima</span>
      </div>
      <div class="nav-section">
        <p class="nav-section-title">MAIN</p>
        <a href="#" class="nav-link active" id="nav-monitor" onclick="switchTab('monitor')">Live Monitor</a>
        <a href="#" class="nav-link">Scan Entry</a>
        <a href="#" class="nav-link">Scan Exit</a>
        <a href="#" class="nav-link">Payments</a>
        <a href="#" class="nav-link" id="nav-log" onclick="switchTab('log')">Transaction Log</a>
      </div>
      <div class="nav-section">
        <p class="nav-section-title">ACCOUNT</p>
        <a href="my-profile.php?role=attendant" class="nav-link">My Profile</a>
        <a href="#" class="nav-link">Wallet Top-Up</a>
      </div>
      <a href="index.php" class="sidebar-button">Log Out</a>
    </aside>

    <main class="dashboard-main">
      <header class="dashboard-header">
        <div id="header-monitor">
          <h1 class="dashboard-title">Live Monitor</h1>
          <p class="overview-date">Monitor real-time occupancy · <span id="liveClock">Loading...</span></p>
        </div>
        <div id="header-log" class="hidden">
          <h1 class="dashboard-title">Transaction Log</h1>
          <p class="overview-date">Review and manage historical parking data</p>
        </div>
        <div class="dashboard-actions">
          <span class="profile-pill" style="background: #06b6d4;">Attendant</span>
          <a href="my-profile.php?role=attendant" class="profile-avatar" style="width: 38px; height: 38px; margin-left: 12px; display: block;">
            <img src="logo.png" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;" />
          </a>
        </div>
      </header>

      <!-- Live Monitor View -->
      <div id="view-monitor">
        <section class="summary-grid">
          <article class="card summary-card">
            <span class="summary-card-top">Currently Parked</span>
            <div class="summary-card-value text-success" style="display: flex; align-items: center; gap: 8px;">
              48 <span style="font-size: 20px;">✓</span>
            </div>
            <div class="summary-card-detail">Active sessions</div>
          </article>

          <article class="card summary-card">
            <span class="summary-card-top">Parking Occupancy</span>
            <div class="summary-card-value">48/100</div>
            <div class="progress-track" style="margin: 10px 0;"><div class="progress-fill progress-fill-teal" style="width: 48%;"></div></div>
            <div class="summary-card-detail">48% capacity utilized</div>
          </article>

          <article class="card summary-card">
            <span class="summary-card-top">Traffic Load Status</span>
            <div style="margin-top: 8px;">
              <span class="traffic-badge traffic-low">Low Load</span>
            </div>
            <div class="summary-card-value" style="font-size: 24px; margin-top: 8px;">12%</div>
            <div class="summary-card-detail">Hourly entry rate</div>
          </article>
        </section>

        <div class="search-row">
          <input type="text" class="search-input" placeholder="Plate number, owner, or transaction ID..." />
          <select class="filter-select">
            <option>All Statuses</option>
            <option>Parked</option>
            <option>Exited</option>
          </select>
          <a href="#" class="btn-teal-outline">Export CSV</a>
        </div>

        <h2 class="panel-title" style="margin-bottom: 15px;">Currently Parked Vehicles</h2>
        <div class="vehicle-grid">
          <div class="vehicle-card">
            <span style="font-size: 11px; color: #64748b; font-weight: 700;">#0042</span>
            <strong style="font-size: 18px;">ABC 1234</strong>
            <span style="font-size: 13px;">4 Wheels</span>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
              <span class="status-pill status-paid" style="background: #dcfce7; color: #15803d;">Parked</span>
              <span style="color: #06b6d4; font-size: 12px; font-weight: 700;">08:15 AM</span>
            </div>
          </div>
          <!-- Repeat cards as needed -->
          <div class="vehicle-card">
            <span style="font-size: 11px; color: #64748b; font-weight: 700;">#0043</span>
            <strong style="font-size: 18px;">XYZ 5678</strong>
            <span style="font-size: 13px;">Motor</span>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
              <span class="status-pill status-paid" style="background: #dcfce7; color: #15803d;">Parked</span>
              <span style="color: #06b6d4; font-size: 12px; font-weight: 700;">09:02 AM</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Transaction Log View -->
      <div id="view-log" class="hidden">
        <section class="card transactions-card">
          <div class="table-wrap">
            <table class="overview-table">
              <thead>
                <tr>
                  <th>TXN ID</th>
                  <th>DATE</th>
                  <th>VEHICLE ID</th>
                  <th>TYPE</th>
                  <th>ENTRY</th>
                  <th>EXIT</th>
                  <th>DURATION</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>TXN-9021</strong></td>
                  <td>May 20, 2026</td>
                  <td>#0038</td>
                  <td>4 Wheels</td>
                  <td>07:30 AM</td>
                  <td>09:45 AM</td>
                  <td>2h 15m</td>
                  <td>₱40.00</td>
                  <td><span class="status-pill status-paid">Paid</span></td>
                </tr>
                <tr>
                  <td><strong>TXN-9022</strong></td>
                  <td>May 20, 2026</td>
                  <td>#0039</td>
                  <td>Motor</td>
                  <td>08:00 AM</td>
                  <td>--:--</td>
                  <td>--</td>
                  <td>₱10.00</td>
                  <td><span class="status-pill status-unpaid">Unpaid</span></td>
                </tr>
                <tr>
                  <td><strong>TXN-9023</strong></td>
                  <td>May 20, 2026</td>
                  <td>#0040</td>
                  <td>4 Wheels</td>
                  <td>08:15 AM</td>
                  <td>08:45 AM</td>
                  <td>30m</td>
                  <td>₱20.00</td>
                  <td><span class="status-badge status-pending">Pending</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  </div>

  <script>
    function switchTab(view) {
      const views = ['monitor', 'log'];
      views.forEach(v => {
        document.getElementById(`view-${v}`).classList.add('hidden');
        document.getElementById(`header-${v}`).classList.add('hidden');
        document.getElementById(`nav-${v}`).classList.remove('active');
      });
      
      document.getElementById(`view-${view}`).classList.remove('hidden');
      document.getElementById(`header-${view}`).classList.remove('hidden');
      document.getElementById(`nav-${view}`).classList.add('active');
    }

    function updateClock() {
      const clock = document.getElementById('liveClock');
      const now = new Date();
      clock.textContent = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
      });
    }
    setInterval(updateClock, 1000);
    updateClock();
  </script>
</body>
</html>