<?php
require_once 'db.php';
$message = "";
$msg_class = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $full_name = $_POST['full_name'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);
    $role = $_POST['role'];

    try {
        $stmt = $pdo->prepare("INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)");
        $stmt->execute([$full_name, $email, $password, $role]);
        $message = "Account created successfully! You can now log in.";
        $msg_class = "status-paid";
    } catch (PDOException $e) {
        $message = "Error: " . $e->getMessage();
        $msg_class = "error-message";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Register | ParkOptima</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body class="auth-page">
  <header class="topbar">
    <div class="topbar-brand">
      <img src="logo.png" alt="Logo" class="topbar-logo" />
      <span class="topbar-title">ParkOptima</span>
    </div>
  </header>
  <main class="page-shell">
    <section class="card auth-card">
      <img src="logo.png" alt="ParkOptima logo" class="auth-logo" />
      <h1>Create Account</h1>
      <p class="subtitle">Join ParkOptima Management</p>

      <form class="auth-form" method="POST" style="min-height: auto;">
        <?php if ($message): ?>
            <div class="<?php echo $msg_class; ?>" style="margin-bottom: 15px; padding: 10px; border-radius: 12px; text-align: center;">
                <?php echo $message; ?>
            </div>
        <?php endif; ?>

        <div class="form-group">
          <label>Full Name</label>
          <input name="full_name" type="text" placeholder="John Doe" required />
        </div>
        
        <div class="form-group">
          <label>Role</label>
          <select name="role" class="modal-input" style="width: 100%;">
            <option value="owner">Parking Owner</option>
            <option value="attendant">Parking Attendant</option>
          </select>
        </div>

        <div class="form-group">
          <label>Email Address</label>
          <input name="email" type="email" placeholder="user@parkoptima.com" required />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input name="password" type="password" placeholder="********" required />
        </div>

        <button class="cta-button" type="submit">Sign Up</button>
        <p class="helper-text">Already have an account? <a href="owner.php">Log in</a></p>
      </form>
    </section>
  </main>
</body>
</html>