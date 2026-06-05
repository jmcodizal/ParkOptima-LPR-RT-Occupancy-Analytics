<?php
// Mock data for the owner profile
$user_data = [
    'first_name' => 'John',
    'last_name' => 'Doe',
    'email' => isset($_GET['role']) && $_GET['role'] === 'attendant' ? 'attendant@parkoptima.com' : 'owner@parkoptima.com',
    'phone' => '09123456789'
];

$role = $_GET['role'] ?? 'owner';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Profile | ParkOptima</title>
  <link rel="stylesheet" href="style.css" />
  <style>
    .profile-section { margin-bottom: 24px; }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 20px;
    }
    .save-container { display: flex; justify-content: flex-end; }
    .btn-teal { background: #06b6d4 !important; }
    .btn-teal:hover { background: #0891b2 !important; }
    .modal-icon-container {
      width: 64px; height: 64px;
      background: #e0f2fe; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 16px; color: #0284c7;
    }
    .btn-outlined {
      background: transparent !important;
      border: 1px solid #d1d5db !important;
      color: #374151 !important;
    }
    .btn-outlined:hover { background: #f9fafb !important; }
    .btn-navy { background: #1f4078 !important; }

    @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <div class="dashboard-shell">
    <aside class="sidebar">
      <div class="sidebar-brand">
        <img src="logo.png" alt="ParkOptima logo" class="sidebar-logo" />
        <div><span class="brand-label">ParkOptima</span></div>
      </div>
      <?php if ($role === 'owner'): ?>
      <div class="nav-section">
        <p class="nav-section-title">MAIN</p>
        <a href="overview.php" class="nav-link">Overview</a>
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
        <a href="my-profile.php?role=owner" class="nav-link active">My Profile</a>
      </div>
      <a href="owner.php" class="sidebar-button">Log Out</a>
      <?php else: ?>
      <div class="nav-section">
        <p class="nav-section-title">MAIN</p>
        <a href="attendant-dashboard.php" class="nav-link">Live Monitor</a>
        <a href="#" class="nav-link">Scan Entry</a>
        <a href="#" class="nav-link">Scan Exit</a>
        <a href="#" class="nav-link">Payments</a>
        <a href="attendant-dashboard.php?tab=log" class="nav-link">Transaction Log</a>
      </div>
      <div class="nav-section">
        <p class="nav-section-title">ACCOUNT</p>
        <a href="my-profile.php?role=attendant" class="nav-link active">My Profile</a>
        <a href="#" class="nav-link">Wallet Top-Up</a>
      </div>
      <a href="attendant.php" class="sidebar-button">Log Out</a>
      <?php endif; ?>
    </aside>

    <main class="dashboard-main">
      <header class="dashboard-header">
        <div>
          <h1 class="dashboard-title">My Profile</h1>
          <p class="overview-date">Update your personal information and account security</p>
        </div>
        <div class="dashboard-actions">
           <a href="my-profile.php?role=<?php echo $role; ?>" class="profile-avatar" style="width: 38px; height: 38px;">
            <img src="logo.png" alt="Profile photo" style="width: 100%; height: 100%; object-fit: cover;" />
          </a>
        </div>
      </header>

      <!-- General Information Section -->
      <section class="card profile-section">
        <h2 class="panel-title" style="margin-bottom: 20px; font-size: 16px; color: #1f3456;">General Information</h2>
        <form onsubmit="event.preventDefault(); openConfirmModal();">
          <div class="form-grid">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="modal-label">First Name</label>
              <input type="text" class="modal-input" value="<?php echo htmlspecialchars($user_data['first_name']); ?>" required />
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="modal-label">Last Name</label>
              <input type="text" class="modal-input" value="<?php echo htmlspecialchars($user_data['last_name']); ?>" required />
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="modal-label">Email Address</label>
              <input type="email" class="modal-input" value="<?php echo htmlspecialchars($user_data['email']); ?>" required />
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="modal-label">Phone Number</label>
              <input type="tel" class="modal-input" value="<?php echo htmlspecialchars($user_data['phone']); ?>" required />
            </div>
          </div>
          <div class="save-container">
            <button type="submit" class="cta-button btn-teal" style="width: auto; padding: 12px 28px;">Save All</button>
          </div>
        </form>
      </section>

      <!-- Password Information Section -->
      <section class="card profile-section">
        <h2 class="panel-title" style="margin-bottom: 20px; font-size: 16px; color: #1f3456;">Password Information</h2>
        <form onsubmit="event.preventDefault(); openConfirmModal();">
          <div class="form-grid">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="modal-label">Current Password</label>
              <input type="password" class="modal-input" placeholder="Enter current password" required />
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="modal-label">New Password</label>
              <input type="password" class="modal-input" placeholder="Enter new password" required />
            </div>
          </div>
          <div class="save-container">
            <button type="submit" class="cta-button btn-teal" style="width: auto; padding: 12px 28px;">Save All</button>
          </div>
        </form>
      </section>
    </main>
  </div>

  <!-- Confirmation Modal -->
  <div id="confirmModal" class="modal-overlay hidden">
    <div class="modal" style="width: min(100%, 400px); text-align: center;">
      <div class="modal-icon-container">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 32px; height: 32px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
      </div>
      <h2 style="font-size: 20px; margin-bottom: 10px; color: #1f3456;">Save Configuration</h2>
      <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">Save all changes to your profile?</p>
      <div style="display: flex; gap: 12px; justify-content: center;">
        <button id="cancelBtn" class="cta-button btn-outlined" style="width: 100%; border-radius: 12px;">Cancel</button>
        <button id="confirmBtn" class="cta-button btn-navy" style="width: 100%; border-radius: 12px;">Confirm</button>
      </div>
    </div>
  </div>

  <script>
    const modal = document.getElementById('confirmModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const confirmBtn = document.getElementById('confirmBtn');
    function openConfirmModal() { modal.classList.remove('hidden'); }
    cancelBtn.addEventListener('click', () => { modal.classList.add('hidden'); });
    confirmBtn.addEventListener('click', () => { modal.classList.add('hidden'); alert('Changes saved!'); });
    window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
  </script>
</body>
</html>