<?php
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>User Registration Portal | ParkOptima</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body class="auth-page">
  <header class="topbar">
    <div class="topbar-brand">
      <img src="logo.png" alt="ParkOptima logo" class="topbar-logo" />
      <span class="topbar-title">ParkOptima</span>
    </div>
  </header>
  <main class="page-shell">
    <section class="card auth-card">
      <img src="logo.png" alt="ParkOptima logo" class="auth-logo" />
      <h1>User Management</h1>
      <p class="subtitle">Setup system access for new personnel</p>

      <div class="welcome-panel">
        <h2>Is this a new user?</h2>
        <p style="margin-bottom: 25px; color: #64748b;">Check if the personnel already has an existing account before creating a duplicate entry.</p>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          <a class="cta-button" href="register.php">No, Create New Account</a>

          <div style="padding: 15px; border: 2px dashed #e2e8f0; border-radius: 16px; margin-top: 10px;">
            <p style="font-size: 0.85rem; color: #1f4078; font-weight: 600; margin-bottom: 8px;">Already has an account?</p>
            <div style="display: flex; gap: 10px; justify-content: center;">
              <a href="owner.php" class="link-button" style="color: #06b6d4;">Owner Login</a>
              <span style="color: #cbd5e1;">|</span>
              <a href="attendant.php" class="link-button" style="color: #06b6d4;">Attendant Login</a>
            </div>
          </div>
        </div>
      </div>

      <div style="margin-top: 30px; display: flex; flex-direction: column; gap: 15px; align-items: center;">
        <a href="user-accounts.php" class="link-button" style="color: #64748b; font-size: 14px;">← Back to Dashboard</a>
        <a href="index.php" class="cta-button" style="background: #d60000; width: 100%; max-width: 200px;">Exit System</a>
      </div>
    </section>
  </main>
</body>
</html>