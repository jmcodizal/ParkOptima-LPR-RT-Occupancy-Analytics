<?php
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Analytics | ParkOptima</title>
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
        <a href="overview.php" class="nav-link">Overview</a>
        <a href="analytics.php" class="nav-link active">Analytics</a>
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

    <main class="dashboard-main">
      <header class="dashboard-header">
        <div>
          <h1 class="dashboard-title">Analytics & Reports</h1>
          <p class="overview-date">Today · <span id="analyticsDate">Loading time…</span></p>
        </div>
        <div class="dashboard-actions">
          <span class="profile-pill">Parking Owner</span>
          <a href="my-profile.php?role=owner" class="profile-avatar" style="width: 38px; height: 38px; margin-left: 12px; display: block;">
            <img src="logo.png" alt="Profile photo" style="width: 100%; height: 100%; object-fit: cover;" />
          </a>
        </div>
      </header>

      <section class="dashboard-grid">
        <article class="card panel">
          <div class="panel-header">
            <h2 class="panel-title">Monthly Revenue & Entries</h2>
          </div>
          <div class="chart-card">
            <div class="chart-axis">
              <div class="y-labels">
                <span>28</span>
                <span>21</span>
                <span>14</span>
                <span>7</span>
                <span>0</span>
              </div>
              <div class="chart-view">
                <svg viewBox="0 0 600 320" class="line-svg" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stop-color="#07b88f" stop-opacity="0.16" />
                      <stop offset="100%" stop-color="#07b88f" stop-opacity="0" />
                    </linearGradient>
                  </defs>
                  <g class="grid-lines">
                    <line x1="50" y1="280" x2="580" y2="280" />
                    <line x1="50" y1="220" x2="580" y2="220" />
                    <line x1="50" y1="160" x2="580" y2="160" />
                    <line x1="50" y1="100" x2="580" y2="100" />
                    <line x1="50" y1="40" x2="580" y2="40" />
                    <line x1="50" y1="40" x2="50" y2="280" />
                  </g>
                  <path class="line-plot revenue" d="M50 280 C110 280 150 280 190 66 S250 280 290 280 S350 280 390 280 S450 280 490 280 S550 280 580 280" />
                  <path class="line-plot entries" d="M50 280 C110 280 150 280 190 220 S250 280 290 280 S350 280 390 280 S450 280 490 280 S550 280 580 280" />
                  <circle class="plot-point revenue" cx="50" cy="280" r="5" data-tooltip="Jan · Revenue: ₱0 · Entries: 0"></circle>
                  <circle class="plot-point entries" cx="50" cy="280" r="5" data-tooltip="Jan · Revenue: ₱0 · Entries: 0"></circle>
                  <circle class="plot-point revenue" cx="110" cy="280" r="5" data-tooltip="Feb · Revenue: ₱0 · Entries: 0"></circle>
                  <circle class="plot-point entries" cx="110" cy="280" r="5" data-tooltip="Feb · Revenue: ₱0 · Entries: 0"></circle>
                  <circle class="plot-point revenue" cx="150" cy="280" r="5" data-tooltip="Mar · Revenue: ₱0 · Entries: 0"></circle>
                  <circle class="plot-point entries" cx="150" cy="280" r="5" data-tooltip="Mar · Revenue: ₱0 · Entries: 0"></circle>
                  <circle class="plot-point revenue" cx="190" cy="66" r="5" data-tooltip="Apr · Revenue: ₱25 · Entries: 7"></circle>
                  <circle class="plot-point entries" cx="190" cy="220" r="5" data-tooltip="Apr · Revenue: ₱25 · Entries: 7"></circle>
                  <circle class="plot-point revenue" cx="240" cy="280" r="5" data-tooltip="May · Revenue: ₱0 · Entries: 0"></circle>
                  <circle class="plot-point entries" cx="240" cy="280" r="5" data-tooltip="May · Revenue: ₱0 · Entries: 0"></circle>
                  <circle class="plot-point revenue" cx="290" cy="280" r="5" data-tooltip="Jun · Revenue: ₱0 · Entries: 0"></circle>
                  <circle class="plot-point entries" cx="290" cy="280" r="5" data-tooltip="Jun · Revenue: ₱0 · Entries: 0"></circle>
                  <circle class="plot-point revenue" cx="340" cy="280" r="5" data-tooltip="Jul · Revenue: ₱0 · Entries: 0"></circle>
                  <circle class="plot-point entries" cx="340" cy="280" r="5" data-tooltip="Jul · Revenue: ₱0 · Entries: 0"></circle>
                  <circle class="plot-point revenue" cx="390" cy="280" r="5" data-tooltip="Aug · Revenue: ₱0 · Entries: 0"></circle>
                  <circle class="plot-point entries" cx="390" cy="280" r="5" data-tooltip="Aug · Revenue: ₱0 · Entries: 0"></circle>
                  <circle class="plot-point revenue" cx="440" cy="280" r="5" data-tooltip="Sep · Revenue: ₱0 · Entries: 0"></circle>
                  <circle class="plot-point entries" cx="440" cy="280" r="5" data-tooltip="Sep · Revenue: ₱0 · Entries: 0"></circle>
                  <circle class="plot-point revenue" cx="490" cy="280" r="5" data-tooltip="Oct · Revenue: ₱0 · Entries: 0"></circle>
                  <circle class="plot-point entries" cx="490" cy="280" r="5" data-tooltip="Oct · Revenue: ₱0 · Entries: 0"></circle>
                  <circle class="plot-point revenue" cx="540" cy="280" r="5" data-tooltip="Nov · Revenue: ₱0 · Entries: 0"></circle>
                  <circle class="plot-point entries" cx="540" cy="280" r="5" data-tooltip="Nov · Revenue: ₱0 · Entries: 0"></circle>
                  <circle class="plot-point revenue" cx="580" cy="280" r="5" data-tooltip="Dec · Revenue: ₱0 · Entries: 0"></circle>
                  <circle class="plot-point entries" cx="580" cy="280" r="5" data-tooltip="Dec · Revenue: ₱0 · Entries: 0"></circle>
                </svg>
                <div class="tooltip-overlay" id="lineTooltip"></div>
                <div class="x-axis">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                </div>
              </div>
            </div>
            <div class="chart-key chart-legend">
              <span><span class="legend-swatch revenue"></span>Revenue (₱)</span>
              <span><span class="legend-swatch entries"></span>Entries</span>
            </div>
          </div>
        </article>

        <article class="card panel">
          <div class="panel-header">
            <h2 class="panel-title">Payment Status Distribution</h2>
          </div>
          <div class="pie-chart">
            <div class="pie-tooltip" id="pieTooltip"></div>
            <div class="pie-segment pie-paid" data-tooltip="Paid: 50%"></div>
            <div class="pie-segment pie-unpaid" data-tooltip="Unpaid: 50%"></div>
          </div>
          <div class="chart-legend">
            <span><span class="legend-swatch paid"></span>Paid</span>
            <span><span class="legend-swatch unpaid"></span>Unpaid</span>
          </div>
        </article>

        <article class="card panel">
          <div class="panel-header">
            <h2 class="panel-title">Quarterly Performance</h2>
          </div>
          <div class="stats-list">
            <div class="progress-row">
              <div class="progress-label">Q1 (Jan-Mar)</div>
              <div class="progress-meta">0 vehicles · ₱0</div>
            </div>
            <div class="progress-track"><div class="progress-fill" style="width:0%"></div></div>
            <div class="progress-row">
              <div class="progress-label">Q2 (Apr-Jun)</div>
              <div class="progress-meta">7 vehicles · ₱25</div>
            </div>
            <div class="progress-track"><div class="progress-fill progress-fill-teal" style="width:78%"></div></div>
            <div class="progress-row">
              <div class="progress-label">Q3 (Jul-Sep)</div>
              <div class="progress-meta">0 vehicles · ₱0</div>
            </div>
            <div class="progress-track"><div class="progress-fill" style="width:0%"></div></div>
            <div class="progress-row">
              <div class="progress-label">Q4 (Oct-Dec)</div>
              <div class="progress-meta">0 vehicles · ₱0</div>
            </div>
            <div class="progress-track"><div class="progress-fill" style="width:0%"></div></div>
          </div>
        </article>

        <article class="card panel">
          <div class="panel-header">
            <h2 class="panel-title">Year-over-Year Comparison</h2>
          </div>
          <div class="stats-list">
            <div class="progress-row">
              <div class="progress-label">Total Vehicles</div>
              <div class="progress-meta">2026: 7 · 2025: 0</div>
            </div>
            <div class="progress-track"><div class="progress-fill progress-fill-teal" style="width:100%"></div></div>
            <div class="progress-row">
              <div class="progress-label">Total Revenue</div>
              <div class="progress-meta">2026: ₱25 · 2025: ₱0</div>
            </div>
            <div class="progress-track"><div class="progress-fill progress-fill-teal" style="width:100%"></div></div>
            <div class="progress-row">
              <div class="progress-label">Collection Rate</div>
              <div class="progress-meta">2026: 29% · 2025: 0%</div>
            </div>
            <div class="progress-track"><div class="progress-fill progress-fill-teal" style="width:29%"></div></div>
          </div>
        </article>

        <article class="card panel">
          <div class="panel-header">
            <h2 class="panel-title">Weekly Comparison</h2>
          </div>
          <div class="stats-list">
            <div class="progress-row">
              <div class="progress-label">Week 1</div>
              <div class="progress-meta">7 entries · ₱25</div>
            </div>
            <div class="progress-track"><div class="progress-fill progress-fill-teal" style="width:100%"></div></div>
            <div class="progress-row">
              <div class="progress-label">Week 2</div>
              <div class="progress-meta">0 entries · ₱0</div>
            </div>
            <div class="progress-track"><div class="progress-fill" style="width:0%"></div></div>
            <div class="progress-row">
              <div class="progress-label">Week 3</div>
              <div class="progress-meta">0 entries · ₱0</div>
            </div>
            <div class="progress-track"><div class="progress-fill" style="width:0%"></div></div>
            <div class="progress-row">
              <div class="progress-label">Week 4</div>
              <div class="progress-meta">0 entries · ₱0</div>
            </div>
            <div class="progress-track"><div class="progress-fill" style="width:0%"></div></div>
          </div>
        </article>

        <article class="card panel">
          <div class="panel-header">
            <h2 class="panel-title">Peak Days This Month</h2>
          </div>
          <p class="metric-number">25</p>
          <p class="metric-label">04/06/2026</p>
          <p class="metric-note">7 entries</p>
        </article>

        <article class="card panel">
          <div class="panel-header">
            <h2 class="panel-title">Returning vs New Vehicle Owners</h2>
          </div>
          <div class="stats-list">
            <div class="progress-row">
              <div class="progress-label">Returning</div>
              <div class="progress-meta">0 (0%)</div>
            </div>
            <div class="progress-track"><div class="progress-fill" style="width:0%"></div></div>
            <div class="progress-row">
              <div class="progress-label">New</div>
              <div class="progress-meta">7 (100%)</div>
            </div>
            <div class="progress-track"><div class="progress-fill progress-fill-blue" style="width:100%"></div></div>
          </div>
        </article>

        <article class="card panel">
          <div class="panel-header">
            <h2 class="panel-title">Payment Status</h2>
          </div>
          <div class="stats-list">
            <div class="progress-row">
              <div class="progress-label">Paid</div>
              <div class="progress-meta">2 (50%)</div>
            </div>
            <div class="progress-track"><div class="progress-fill progress-fill-teal" style="width:50%"></div></div>
            <div class="progress-row">
              <div class="progress-label">Unpaid</div>
              <div class="progress-meta">2 (50%)</div>
            </div>
            <div class="progress-track"><div class="progress-fill progress-fill-orange" style="width:50%"></div></div>
          </div>
        </article>
      </section>
    </main>
  </div>
  <script>
    function updateAnalyticsDate() {
      const dateElement = document.getElementById('analyticsDate');
      if (!dateElement) return;
      const now = new Date();
      const options = { month: 'long', day: 'numeric', year: 'numeric' };
      const dateString = now.toLocaleDateString('en-US', options);
      const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' });
      dateElement.textContent = `${dateString} · ${timeString}`;
    }

    function bindAnalyticsTooltips() {
      const lineTooltip = document.getElementById('lineTooltip');
      const points = document.querySelectorAll('.plot-point');
      const chartView = document.querySelector('.chart-view');

      if (lineTooltip && points && chartView) {
        points.forEach(point => {
          const tooltipText = point.getAttribute('data-tooltip');
          point.addEventListener('mouseenter', () => {
            lineTooltip.textContent = tooltipText || '';
            lineTooltip.style.opacity = '1';
          });
          point.addEventListener('mouseleave', () => {
            lineTooltip.style.opacity = '0';
          });
        });
      }

      const pieTooltip = document.getElementById('pieTooltip');
      const pieSegments = document.querySelectorAll('.pie-segment');
      if (pieTooltip && pieSegments) {
        pieSegments.forEach(segment => {
          const tooltipText = segment.getAttribute('data-tooltip');
          segment.addEventListener('mouseenter', () => {
            pieTooltip.textContent = tooltipText || '';
            pieTooltip.style.opacity = '1';
          });
          segment.addEventListener('mouseleave', () => {
            pieTooltip.style.opacity = '0';
          });
        });
      }
    }

    updateAnalyticsDate();
    setInterval(updateAnalyticsDate, 1000);
    bindAnalyticsTooltips();
  </script>
</body>
</html>
