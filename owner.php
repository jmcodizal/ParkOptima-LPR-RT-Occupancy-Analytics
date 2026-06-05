<?php
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Owner | ParkOptima</title>
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
        <a href="owner.php" class="tab active">Owner</a>
        <a href="attendant.php" class="tab">Attendant</a>
        <a href="vehicleowner.php" class="tab">Vehicle Owner</a>
      </div>

      <form id="ownerLoginForm" class="auth-form" action="#" method="post">
        <div id="ownerError" class="error-message hidden" role="alert"></div>
        <div class="form-group">
          <label for="ownerEmail">Email Address</label>
          <input id="ownerEmail" name="email" type="email" placeholder="owner@parkoptima.com" required />
        </div>

        <div class="form-group">
          <label for="ownerPassword">Password</label>
          <input id="ownerPassword" name="password" type="password" placeholder="********" required />
        </div>

        <div class="form-row">
          <label class="checkbox-group">
            <input id="ownerRemember" type="checkbox" name="remember" />
            Remember Me
          </label>
        </div>

        <button class="cta-button" type="submit">Log in</button>
        <div class="helper-text">
          <p>Forgot password? <button id="ownerForgotLink" type="button" class="link-button">Reset here</button></p>
        </div>
      </form>
    </section>
  </main>

  <div id="ownerForgotModal" class="modal-overlay hidden">
    <div class="modal">
      <div class="modal-header">
        <div>
          <h2>Password Reset</h2>
          <p class="modal-subtitle">Enter your email address and we'll help you recover your password.</p>
        </div>
        <button id="ownerForgotClose" class="modal-close" aria-label="Close reset modal">×</button>
      </div>
      <div class="modal-content">
        <label class="modal-label" for="ownerForgotEmail">Enter your email</label>
        <input id="ownerForgotEmail" type="email" placeholder="Enter your email" class="modal-input" />
        <button id="ownerSendReset" class="modal-button">Send Reset Link</button>
        <p id="ownerForgotStatus" class="modal-status"></p>
      </div>
    </div>
  </div>

  <script>
    const ownerCredentials = {
      email: "owner@parkoptima.com",
      password: "Owner@2025"
    };

    const ownerEmailInput = document.getElementById("ownerEmail");
    const ownerPasswordInput = document.getElementById("ownerPassword");
    const ownerRememberInput = document.getElementById("ownerRemember");
    const ownerError = document.getElementById("ownerError");
    const ownerLoginForm = document.getElementById("ownerLoginForm");
    const ownerForgotLink = document.getElementById("ownerForgotLink");
    const ownerForgotModal = document.getElementById("ownerForgotModal");
    const ownerForgotClose = document.getElementById("ownerForgotClose");
    const ownerForgotEmail = document.getElementById("ownerForgotEmail");
    const ownerSendReset = document.getElementById("ownerSendReset");
    const ownerForgotStatus = document.getElementById("ownerForgotStatus");

    function loadOwnerCredentials() {
      const saved = localStorage.getItem("parkoptima_owner_credentials");
      if (!saved) return;
      try {
        const parsed = JSON.parse(saved);
        ownerEmailInput.value = parsed.email || "";
        ownerPasswordInput.value = parsed.password || "";
        ownerRememberInput.checked = true;
      } catch (err) {
        console.error(err);
      }
    }

    function saveOwnerCredentials() {
      const payload = {
        email: ownerEmailInput.value,
        password: ownerPasswordInput.value
      };
      localStorage.setItem("parkoptima_owner_credentials", JSON.stringify(payload));
    }

    function clearOwnerCredentials() {
      localStorage.removeItem("parkoptima_owner_credentials");
    }

    function showOwnerError(message) {
      ownerError.textContent = message;
      ownerError.classList.remove("hidden");
    }

    function clearOwnerError() {
      ownerError.textContent = "";
      ownerError.classList.add("hidden");
    }

    ownerLoginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = ownerEmailInput.value.trim();
      const password = ownerPasswordInput.value;

      if (email === ownerCredentials.email && password === ownerCredentials.password) {
        clearOwnerError();
        if (ownerRememberInput.checked) {
          saveOwnerCredentials();
        } else {
          clearOwnerCredentials();
        }
        window.location.href = "overview.php";
        return;
      }

      showOwnerError("Incorrect owner email or password. Please try again.");
    });

    ownerForgotLink.addEventListener("click", () => {
      ownerForgotModal.classList.remove("hidden");
      ownerForgotEmail.value = ownerEmailInput.value || "";
      ownerForgotStatus.textContent = "";
    });

    ownerForgotClose.addEventListener("click", () => {
      ownerForgotModal.classList.add("hidden");
    });

    ownerSendReset.addEventListener("click", () => {
      const email = ownerForgotEmail.value.trim();
      if (!email) {
        ownerForgotStatus.textContent = "Please enter your email address.";
        ownerForgotStatus.className = "modal-status text-red-600";
        return;
      }
      ownerForgotStatus.textContent = "If that email is registered, a reset link has been sent.";
      ownerForgotStatus.className = "modal-status text-teal-600";
    });

    loadOwnerCredentials();
  </script>
</body>
</html>
