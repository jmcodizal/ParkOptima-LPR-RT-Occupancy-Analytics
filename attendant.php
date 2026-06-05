<?php
$active = 'attendant';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Attendant | ParkOptima</title>
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
      <h1>ParkOptima</h1>
      <p class="subtitle">Smart Parking Management System</p>

      <div class="tabs">
        <a href="owner.php" class="tab">Owner</a>
        <a href="attendant.php" class="tab active">Attendant</a>
        <a href="vehicleowner.php" class="tab">Vehicle Owner</a>
      </div>

      <form id="attendantLoginForm" class="auth-form" action="#" method="post">
        <div id="attendantError" class="error-message hidden" role="alert"></div>
        <div class="form-group">
          <label for="attendantEmail">Email Address</label>
          <input id="attendantEmail" name="email" type="email" placeholder="attendant@parkoptima.com" required />
        </div>

        <div class="form-group">
          <label for="attendantPassword">Password</label>
          <input id="attendantPassword" name="password" type="password" placeholder="********" required />
        </div>

        <div class="form-row">
          <label class="checkbox-group">
            <input id="attendantRemember" type="checkbox" name="remember" />
            Remember Me
          </label>
        </div>

        <button class="cta-button" type="submit">Log in</button>
        <div class="helper-text">
          <p>Forgot password? <button id="attendantForgotLink" type="button" class="link-button">Reset here</button></p>
        </div>
      </form>
    </section>
  </main>

  <div id="attendantForgotModal" class="modal-overlay hidden">
    <div class="modal">
      <div class="modal-header">
        <div>
          <h2>Password Reset</h2>
          <p class="modal-subtitle">Enter your email address and we'll help you recover your password.</p>
        </div>
        <button id="attendantForgotClose" class="modal-close" aria-label="Close reset modal">×</button>
      </div>
      <div class="modal-content">
        <label class="modal-label" for="attendantForgotEmail">Enter your email</label>
        <input id="attendantForgotEmail" type="email" placeholder="Enter your email" class="modal-input" />
        <button id="attendantSendReset" class="modal-button">Send Reset Link</button>
        <p id="attendantForgotStatus" class="modal-status"></p>
      </div>
    </div>
  </div>

  <script>
    const attendantCredentials = {
      email: "attendant@parkoptima.com",
      password: "Attendant@2025"
    };

    const attendantEmailInput = document.getElementById("attendantEmail");
    const attendantPasswordInput = document.getElementById("attendantPassword");
    const attendantRememberInput = document.getElementById("attendantRemember");
    const attendantError = document.getElementById("attendantError");
    const attendantLoginForm = document.getElementById("attendantLoginForm");
    const attendantForgotLink = document.getElementById("attendantForgotLink");
    const attendantForgotModal = document.getElementById("attendantForgotModal");
    const attendantForgotClose = document.getElementById("attendantForgotClose");
    const attendantForgotEmail = document.getElementById("attendantForgotEmail");
    const attendantSendReset = document.getElementById("attendantSendReset");
    const attendantForgotStatus = document.getElementById("attendantForgotStatus");

    function loadAttendantCredentials() {
      const saved = localStorage.getItem("parkoptima_attendant_credentials");
      if (!saved) return;
      try {
        const parsed = JSON.parse(saved);
        attendantEmailInput.value = parsed.email || "";
        attendantPasswordInput.value = parsed.password || "";
        attendantRememberInput.checked = true;
      } catch (err) {
        console.error(err);
      }
    }

    function saveAttendantCredentials() {
      const payload = {
        email: attendantEmailInput.value,
        password: attendantPasswordInput.value
      };
      localStorage.setItem("parkoptima_attendant_credentials", JSON.stringify(payload));
    }

    function clearAttendantCredentials() {
      localStorage.removeItem("parkoptima_attendant_credentials");
    }

    function showAttendantError(message) {
      attendantError.textContent = message;
      attendantError.classList.remove("hidden");
    }

    function clearAttendantError() {
      attendantError.textContent = "";
      attendantError.classList.add("hidden");
    }

    attendantLoginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = attendantEmailInput.value.trim();
      const password = attendantPasswordInput.value;

      if (email === attendantCredentials.email && password === attendantCredentials.password) {
        clearAttendantError();
        if (attendantRememberInput.checked) {
          saveAttendantCredentials();
        } else {
          clearAttendantCredentials();
        }
        window.location.href = "attendant-dashboard.php";
        return;
      }

      showAttendantError("Incorrect attendant email or password. Please try again.");
    });

    attendantForgotLink.addEventListener("click", () => {
      attendantForgotModal.classList.remove("hidden");
      attendantForgotEmail.value = attendantEmailInput.value || "";
      attendantForgotStatus.textContent = "";
    });

    attendantForgotClose.addEventListener("click", () => {
      attendantForgotModal.classList.add("hidden");
    });

    attendantSendReset.addEventListener("click", () => {
      const email = attendantForgotEmail.value.trim();
      if (!email) {
        attendantForgotStatus.textContent = "Please enter your email address.";
        attendantForgotStatus.className = "modal-status text-red-600";
        return;
      }
      attendantForgotStatus.textContent = "If that email is registered, a reset link has been sent.";
      attendantForgotStatus.className = "modal-status text-teal-600";
    });

    loadAttendantCredentials();
  </script>
</body>
</html>
