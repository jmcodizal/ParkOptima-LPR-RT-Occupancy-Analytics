<?php
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Overview | ParkOptima</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="dashboard-shell">
    <aside class="sidebar">
      <div class="sidebar-brand">
        <img src="logo.png" alt="ParkOptima logo" class="sidebar-logo" />
        <div>
          <span class="brand-label">ParkOptima</span>
        </div>
      </div>

      <div class="nav-section">
        <p class="nav-section-title">MAIN</p>
        <a href="overview.php" class="nav-link active">Overview</a>
        <a href="analytics.php" class="nav-link">Analytics</a>
        <a href="#daily" class="nav-link">Daily Reports</a>
        <a href="#monthly" class="nav-link">Monthly Reports</a>
        <a href="#yearly" class="nav-link">Yearly Reports</a>
        <a href="#transactions" class="nav-link">Transaction Log</a>
      </div>

      <div class="nav-section">
        <p class="nav-section-title">MANAGEMENT</p>
        <a href="user-accounts.php" class="nav-link">User Accounts</a>
        <a href="#settings" class="nav-link">System Settings</a>
        <a href="#audit" class="nav-link">Audit Trail</a>
      </div>

      <div class="nav-section">
        <p class="nav-section-title">ACCOUNT</p>
        <a href="my-profile.php?role=owner" class="nav-link">My Profile</a>
      </div>

      <a href="owner.php" class="sidebar-button">Log Out</a>
    </aside>

    <main class="dashboard-main overview-main">
      <section class="overview-header">
        <div>
          <h1 class="overview-title">Good morning, Parking Owner</h1>
          <p class="overview-date">Today · <span id="overviewDate">Loading time…</span></p>
        </div>
        <div class="overview-profile">
          <span class="profile-pill">Parking Owner</span>
          <a href="my-profile.php?role=owner" class="profile-avatar">
            <img src="logo.png" alt="Profile photo" />
          </a>
        </div>
      </section>

      <section class="summary-grid">
        <article class="summary-card">
          <span class="summary-card-top">Total vehicles today</span>
          <div class="summary-card-value">7</div>
          <div class="summary-card-detail">transactions</div>
          <div class="summary-card-note">3 currently parked</div>
        </article>

        <article class="summary-card">
          <span class="summary-card-top">Revenue collected</span>
          <div class="summary-card-value">₱25.00</div>
          <div class="summary-card-detail text-success">29% collection rate</div>
        </article>

        <article class="summary-card">
          <span class="summary-card-top">Unpaid vehicles</span>
          <div class="summary-card-value text-alert">2</div>
          <div class="summary-card-detail text-alert">₱25.00 pending</div>
          <div class="summary-card-note text-alert-light">Needs attention</div>
        </article>
      </section>

      <section class="overview-grid">
        <article class="card chart-card">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">Hourly vehicle flow</h2>
            </div>
            <span class="panel-meta">Today</span>
          </div>
          <div class="bar-chart">
            <div class="bar-labels">
              <span>7am</span>
              <span>8am</span>
              <span>9am</span>
              <span>10am</span>
              <span>11am</span>
              <span>12pm</span>
              <span>1pm</span>
              <span>2pm</span>
              <span>3pm</span>
              <span>4pm</span>
            </div>
            <div class="bar-graphic">
              <div class="bar bar-1" data-tooltip="7am · 1 vehicle"></div>
              <div class="bar bar-1" data-tooltip="8am · 1 vehicle"></div>
              <div class="bar bar-2" data-tooltip="9am · 2 vehicles"></div>
              <div class="bar bar-2" data-tooltip="10am · 2 vehicles"></div>
              <div class="bar" data-tooltip="11am · 0 vehicles"></div>
              <div class="bar" data-tooltip="12pm · 0 vehicles"></div>
              <div class="bar" data-tooltip="1pm · 0 vehicles"></div>
              <div class="bar" data-tooltip="2pm · 0 vehicles"></div>
              <div class="bar" data-tooltip="3pm · 0 vehicles"></div>
              <div class="bar" data-tooltip="4pm · 0 vehicles"></div>
            </div>
          </div>
        </article>

        <article class="card revenue-card">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">Revenue Summary</h2>
            </div>
            <span class="panel-meta">Today</span>
          </div>
          <div class="revenue-summary">
            <div class="summary-row">
              <span>Total transactions</span>
              <strong>7</strong>
            </div>
            <div class="summary-row">
              <span>Collected</span>
              <strong class="text-success">₱25.00</strong>
            </div>
            <div class="summary-row">
              <span>Uncollected</span>
              <strong class="text-alert">₱25.00</strong>
            </div>
          </div>
          <div class="progress-track wide">
            <div class="progress-fill progress-fill-teal" style="width: 58%;"></div>
          </div>
          <p class="progress-caption">29% collection rate today</p>
        </article>
      </section>

      <section class="card transactions-card">
        <div class="panel-header transactions-header">
          <h2 class="panel-title">Recent transactions</h2>
          <a href="#" class="view-all-link">View all</a>
        </div>
        <div class="table-wrap">
          <table class="overview-table">
            <thead>
              <tr>
                <th>VEHICLE ID</th>
                <th>PLATE NUMBER</th>
                <th>VEHICLE TYPE</th>
                <th>ENTRY</th>
                <th>EXIT</th>
                <th>FEE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>006</td>
                <td>MNO 1122</td>
                <td>Motor</td>
                <td>07:00 AM</td>
                <td>08:00 AM</td>
                <td>₱5</td>
                <td><span class="status-pill status-paid">Paid</span></td>
              </tr>
              <tr>
                <td>007</td>
                <td>PQR 3344</td>
                <td>4 Wheels</td>
                <td>06:30 AM</td>
                <td>07:45 AM</td>
                <td>₱20</td>
                <td><span class="status-pill status-paid">Paid</span></td>
              </tr>
              <tr>
                <td>004</td>
                <td>GHI 3456</td>
                <td>Motor</td>
                <td>10:00 AM</td>
                <td>11:30 AM</td>
                <td>₱5</td>
                <td><span class="status-pill status-unpaid">Unpaid</span></td>
              </tr>
              <tr>
                <td>005</td>
                <td>JKL 7890</td>
                <td>4 Wheels</td>
                <td>10:30 AM</td>
                <td>12:00 PM</td>
                <td>₱20</td>
                <td><span class="status-pill status-unpaid">Unpaid</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
  <script>
    function updateOverviewDate() {
      const dateElement = document.getElementById('overviewDate');
      if (!dateElement) return;
      const now = new Date();
      const options = { month: 'long', day: 'numeric', year: 'numeric' };
      const dateString = now.toLocaleDateString('en-US', options);
      const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' });
      dateElement.textContent = `${dateString} · ${timeString}`;
    }
    updateOverviewDate();
    setInterval(updateOverviewDate, 1000);
  </script>
</body>
</html>
