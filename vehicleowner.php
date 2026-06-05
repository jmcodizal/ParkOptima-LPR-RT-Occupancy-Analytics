<?php
$active = 'vehicleowner';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vehicle Owner | ParkOptima</title>
  <link rel="stylesheet" href="style.css" />
  <style>
    /* Specific styles for Vehicle Owner Flow */
    .icon-circle {
      width: 56px;
      height: 56px;
      background: #d1faf0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }
    .icon-circle svg {
      color: #0eb68a;
      width: 28px;
      height: 28px;
    }
    .note-box {
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 13px;
      margin-top: 20px;
      text-align: left;
    }
    .note-blue {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      color: #1e40af;
    }
    .note-teal {
      background: #e6faf5;
      color: #065f46;
    }
    .input-wrapper {
      position: relative;
    }
    .eye-toggle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;      
      width: 24px; /* Adjust size as needed */
      height: 24px; /* Adjust size as needed */
      color: #64748b;
    }
    .toggle-group {
      display: flex;
      gap: 10px;
    }
    .toggle-btn {
      flex: 1;
      padding: 12px;
      border-radius: 12px;
      border: none;
      background: #f1f5f9;
      color: #1e3a6e;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .toggle-btn.active {
      background: #1e3a6e;
      color: #ffffff;
    }
    .balance-teal-card {
      background: #0eb68a;
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      color: white;
      margin-bottom: 20px;
    }
    .balance-label {
      font-size: 13px;
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .balance-amount {
      font-size: 36px;
      font-weight: 800;
      margin-top: 4px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
      font-size: 14px;
    }
    .detail-label {
      color: #64748b;
    }
    .detail-value {
      font-weight: 600;
      color: #1e3a6e;
    }
    .error-text {
      color: #ef4444;
      font-size: 12px;
      margin-top: 4px;
    }
    .success-text {
      color: #0eb68a;
      font-weight: 600;
      text-align: center;
      margin-top: 10px;
    }
  </style>
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
      <h1>ParkOptima</h1>
      <p class="subtitle">Smart Parking Management System</p>

      <div class="tabs">
        <a href="owner.php" class="tab">Owner</a>
        <a href="attendant.php" class="tab">Attendant</a>
        <a href="vehicleowner.php" class="tab active">Vehicle Owner</a>
      </div>

      <!-- View Container -->
      <div id="view-check-balance">
        <div class="icon-circle">
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
        </div>
        <h1 style="font-size: 24px;">Check Balance</h1>
        <p class="subtitle">Enter your plate number and PIN to view your balance</p>

        <div id="check-error" class="error-message hidden" style="margin-bottom: 15px;"></div>

        <div class="form-group">
          <label>Plate Number</label>
          <input type="text" id="check-plate" placeholder="ABC 1234" />
        </div>
        <div class="form-group">
          <label>PIN</label>
          <div class="input-wrapper">
            <input type="password" id="check-pin" placeholder="Enter 4-digit PIN" maxlength="4" />
            <button type="button" class="eye-toggle" onclick="togglePin('check-pin')"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg></button>
          </div>
        </div>
        <button class="cta-button" onclick="handleCheckBalance()" style="background: #1e3a6e;">Check Balance</button>
        
        <div class="note-box note-blue">
          Note: If you don't have an account yet, you can <a href="#" onclick="switchView('signUp')" style="color: #0eb68a; font-weight: 700; text-decoration: none;">sign up here</a> or visit an attendant to register your vehicle.
        </div>
      </div>

      <div id="view-balance-result" class="hidden">
        <div class="icon-circle">
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
        </div>
        <h1 style="font-size: 24px;">Check Balance</h1>
        <p class="subtitle">Enter your plate number and PIN to view your balance</p>

        <div class="balance-teal-card">
          <p class="balance-label">Available Balance</p>
          <p class="balance-amount" id="res-balance">₱0.00</p>
        </div>

        <div class="detail-row">
          <span class="detail-label">Plate Number</span>
          <span class="detail-value" id="res-plate">---</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Owner Name</span>
          <span class="detail-value" id="res-owner">---</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Vehicle Type</span>
          <span class="detail-value" id="res-type">---</span>
        </div>
        <div class="detail-row" style="border-bottom: none;">
          <span class="detail-label">Registered</span>
          <span class="detail-value" id="res-date">---</span>
        </div>

        <button class="cta-button" onclick="switchView('checkBalance')" style="background: #f0f0f0; color: #333; margin-top: 15px;">Check Another Account</button>
        
        <div class="note-box note-teal">
          <span style="font-weight: 700; color: #0eb68a;">Need to top up?</span> Visit any attendant with cash to add credits to your account.
        </div>
      </div>

      <div id="view-sign-up" class="hidden">
        <a href="#" onclick="switchView('checkBalance')" style="text-decoration: none; color: #64748b; font-size: 13px; margin-bottom: 10px; display: block;">← Back to Check Balance</a>
        <div class="icon-circle">
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
        </div>
        <h1 style="font-size: 24px;">Sign Up</h1>
        <p class="subtitle">Create your parking account</p>

        <div id="signup-status" class="hidden"></div>

        <div class="form-group">
          <label>Plate Number</label>
          <input type="text" id="reg-plate" placeholder="ABC 1234" />
        </div>
        <div class="form-group">
          <label>Owner Name</label>
          <input type="text" id="reg-name" placeholder="Enter your name" />
        </div>
        <div class="form-group">
          <label>Vehicle Type</label>
          <div class="toggle-group">
            <button class="toggle-btn active" onclick="setVehicleType('Motor', this)">Motor</button>
            <button class="toggle-btn" onclick="setVehicleType('4 Wheels', this)">4 Wheels</button>
          </div>
        </div>
        <div class="form-group">
          <label>PIN</label>
          <div class="input-wrapper">
            <input type="password" id="reg-pin" placeholder="Enter 4-digit PIN" maxlength="4" />
            <button type="button" class="eye-toggle" onclick="togglePin('reg-pin')"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg></button>
          </div>
        </div>
        <div class="form-group">
          <label>Confirm PIN</label>
          <div class="input-wrapper">
            <input type="password" id="reg-pin-confirm" placeholder="Re-enter 4-digit PIN" maxlength="4" />
            <button type="button" class="eye-toggle" onclick="togglePin('reg-pin-confirm')"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg></button>
          </div>
        </div>

        <button class="cta-button" onclick="handleSignUp()" style="background: #1e3a6e; margin-top: 10px;">Sign Up</button>

        <div class="note-box note-blue">
          <span style="font-weight: 700;">Note:</span> Your PIN will be used to check your balance and manage your account. Keep it secure!
        </div>
      </div>
    </section>
  </main>

  <script>
    let mockAccounts = [
      { plateNumber: "ABC 1234", pin: "1234", ownerName: "Harry Potter", vehicleType: "Motor", registered: "05/06/2026", balance: 50.00 },
      { plateNumber: "XYZ 5678", pin: "5678", ownerName: "Hermione Granger", vehicleType: "4 Wheels", registered: "01/15/2026", balance: 120.00 }
    ];

    let selectedVehicleType = 'Motor';

    function switchView(view) {
      document.getElementById('view-check-balance').classList.add('hidden');
      document.getElementById('view-balance-result').classList.add('hidden');
      document.getElementById('view-sign-up').classList.add('hidden');
      document.getElementById('check-error').classList.add('hidden');
      document.getElementById('signup-status').classList.add('hidden');

      if(view === 'checkBalance') document.getElementById('view-check-balance').classList.remove('hidden');
      if(view === 'result') document.getElementById('view-balance-result').classList.remove('hidden');
      if(view === 'signUp') document.getElementById('view-sign-up').classList.remove('hidden');
    }

    function togglePin(id) {
      const input = document.getElementById(id);
      input.type = input.type === 'password' ? 'text' : 'password';
    }

    function setVehicleType(type, btn) {
      selectedVehicleType = type;
      document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }

    function handleCheckBalance() {
      const plate = document.getElementById('check-plate').value.trim();
      const pin = document.getElementById('check-pin').value;
      const errDiv = document.getElementById('check-error');

      if(!plate || !pin) { showErr(errDiv, "All fields are required."); return; }
      if(pin.length !== 4) { showErr(errDiv, "PIN must be exactly 4 digits."); return; }

      const found = mockAccounts.find(acc => 
        acc.plateNumber.replace(/\s/g, "").toUpperCase() === plate.replace(/\s/g, "").toUpperCase() && acc.pin === pin
      );

      if(found) {
        document.getElementById('res-balance').textContent = `₱${found.balance.toFixed(2)}`;
        document.getElementById('res-plate').textContent = found.plateNumber;
        document.getElementById('res-owner').textContent = found.ownerName;
        document.getElementById('res-type').textContent = found.vehicleType;
        document.getElementById('res-date').textContent = found.registered;
        switchView('result');
      } else {
        showErr(errDiv, "Invalid plate number or PIN. Please try again.");
      }
    }

    function handleSignUp() {
      const plate = document.getElementById('reg-plate').value.trim();
      const name = document.getElementById('reg-name').value.trim();
      const pin = document.getElementById('reg-pin').value;
      const confirm = document.getElementById('reg-pin-confirm').value;
      const statusDiv = document.getElementById('signup-status');

      if(!plate || !name || !pin || !confirm) { showErr(statusDiv, "All fields are required."); return; }
      if(!/^\d{4}$/.test(pin)) { showErr(statusDiv, "PIN must be 4 numeric digits."); return; }
      if(pin !== confirm) { showErr(statusDiv, "PINs do not match."); return; }
      
      if(mockAccounts.some(acc => acc.plateNumber.replace(/\s/g, "").toUpperCase() === plate.replace(/\s/g, "").toUpperCase())) {
        showErr(statusDiv, "This plate number is already registered."); return;
      }

      mockAccounts.push({
        plateNumber: plate, pin: pin, ownerName: name, vehicleType: selectedVehicleType,
        registered: new Date().toLocaleDateString("en-PH"), balance: 0.00
      });

      statusDiv.className = "success-text";
      statusDiv.textContent = "Account created successfully! You can now check your balance.";
      statusDiv.classList.remove('hidden');

      setTimeout(() => switchView('checkBalance'), 2000);
    }

    function showErr(div, msg) {
      div.className = "error-message";
      div.textContent = msg;
      div.classList.remove('hidden');
    }
  </script>
</body>
</html>
