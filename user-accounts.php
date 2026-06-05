<?php
require_once 'db.php';

$message = "";
$msg_class = "";

// Handle Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['email'])) {
    $full_name = $_POST['first_name'] . ' ' . $_POST['last_name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'] ?? '';
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);
    $role = $_POST['role'] ?? 'attendant';

    try {
        // Ensure your 'users' table has a 'phone' column. 
        // If not, run: ALTER TABLE users ADD COLUMN phone VARCHAR(20) AFTER email;
        $stmt = $pdo->prepare("INSERT INTO users (full_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$full_name, $email, $phone, $password, $role]);
        header("Location: user-accounts.php?success=1");
        exit();
    } catch (PDOException $e) {
        $message = "Error: " . $e->getMessage();
        $msg_class = "error-message";
    }
}

try {
    $stmt = $pdo->query("SELECT id, full_name, email, role, created_at FROM users ORDER BY created_at DESC");
    $users = $stmt->fetchAll();
} catch (PDOException $e) {
    $users = [];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>User Accounts | ParkOptima</title>
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
        <a href="analytics.php" class="nav-link">Analytics</a>
        <a href="#daily" class="nav-link">Daily Reports</a>
        <a href="#monthly" class="nav-link">Monthly Reports</a>
        <a href="#yearly" class="nav-link">Yearly Reports</a>
        <a href="#transactions" class="nav-link">Transaction Log</a>
      </div>

      <div class="nav-section">
        <p class="nav-section-title">MANAGEMENT</p>
        <a href="user-accounts.php" class="nav-link active">User Accounts</a>
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
          <h1 class="dashboard-title">User Accounts</h1>
          <p class="overview-date">Manage system access for Owners and Attendants</p>
        </div>
        <div class="dashboard-actions">
          <button id="addUserBtn" class="cta-button" style="width: auto; padding: 10px 20px;">+ Add New User</button>
          <a href="my-profile.php?role=owner" class="profile-avatar" style="width: 38px; height: 38px; margin-left: 15px; display: block;">
            <img src="logo.png" alt="Profile photo" style="width: 100%; height: 100%; object-fit: cover;" />
          </a>
        </div>
      </header>

      <?php if (isset($_GET['success'])): ?>
        <div class="status-pill status-paid" style="margin-bottom: 20px; width: 100%; justify-content: center; padding: 12px; border-radius: 12px;">
          ✓ User account created successfully!
        </div>
      <?php endif; ?>

      <section class="card transactions-card" style="margin-top: 20px;">
        <div class="table-wrap">
          <table class="overview-table">
            <thead>
              <tr>
                <th>FULL NAME</th>
                <th>EMAIL</th>
                <th>ROLE</th>
                <th>DATE JOINED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <?php if (empty($users)): ?>
                <tr>
                  <td colspan="5" style="text-align: center; padding: 40px; color: #7b8798;">No users found in database.</td>
                </tr>
              <?php else: ?>
                <?php foreach ($users as $user): ?>
                <tr>
                  <td><strong><?php echo htmlspecialchars($user['full_name'] ?? 'N/A'); ?></strong></td>
                  <td><?php echo htmlspecialchars($user['email']); ?></td>
                  <td>
                    <?php $role_class = ($user['role'] === 'owner') ? 'background: #a855f7; color: white;' : 'background: #06b6d4; color: white;'; ?>
                    <span class="profile-pill" style="<?php echo $role_class; ?>"><?php echo ucfirst($user['role']); ?></span>
                  </td>
                  <td><?php echo date('M d, Y', strtotime($user['created_at'])); ?></td>
                  <td>
                    <button class="link-button" style="color: #1f4078; margin-right: 12px;">Edit</button>
                    <button class="link-button" style="color: #d60000;">Delete</button>
                  </td>
                </tr>
                <?php endforeach; ?>
              <?php endif; ?>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>

  <!-- Add New User Modal -->
  <div id="addUserModal" class="modal-overlay hidden">
    <div class="modal" style="width: min(100%, 460px);">
      <div class="modal-header">
        <div>
          <h2 class="dashboard-title">Add New User</h2>
          <p class="modal-subtitle">Setup system access for new personnel</p>
        </div>
        <button id="closeModal" class="modal-close" aria-label="Close modal">×</button>
      </div>
      <form id="addUserForm" class="modal-content" method="POST" action="user-accounts.php">
        <?php if ($message): ?>
          <div class="<?php echo $msg_class; ?>" style="margin-bottom: 15px; padding: 10px; border-radius: 12px; text-align: center;">
            <?php echo $message; ?>
          </div>
        <?php endif; ?>

        <div class="form-group" style="margin-bottom: 12px;">
          <label class="modal-label">First Name</label>
          <input type="text" name="first_name" class="modal-input" placeholder="e.g. John" required />
        </div>
        <div class="form-group" style="margin-bottom: 12px;">
          <label class="modal-label">Last Name</label>
          <input type="text" name="last_name" class="modal-input" placeholder="e.g. Doe" required />
        </div>
        <div class="form-group" style="margin-bottom: 12px;">
          <label class="modal-label">Phone Number</label>
          <input type="tel" name="phone" class="modal-input" placeholder="09xxxxxxxxx" required />
        </div>
        <div class="form-group" style="margin-bottom: 12px;">
          <label class="modal-label">Role</label>
          <select name="role" class="modal-input" style="width: 100%;">
            <option value="owner">Parking Owner</option>
            <option value="attendant">Parking Attendant</option>
          </select>
        </div>
        <div class="form-group" style="margin-bottom: 12px;">
          <label class="modal-label">Email Address</label>
          <input type="email" name="email" class="modal-input" placeholder="user@parkoptima.com" required />
        </div>
        <div class="form-group" style="margin-bottom: 12px;">
          <label class="modal-label">Password</label>
          <input type="password" name="password" class="modal-input" placeholder="********" required />
        </div>
        <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
          <button type="submit" class="cta-button" style="width: auto; padding: 12px 24px;">Create User</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    const addUserBtn = document.getElementById('addUserBtn');
    const addUserModal = document.getElementById('addUserModal');
    const closeModal = document.getElementById('closeModal');
    const addUserForm = document.getElementById('addUserForm');

    // Open Modal
    addUserBtn.addEventListener('click', () => {
      addUserModal.classList.remove('hidden');
    });

    // Close Modal
    closeModal.addEventListener('click', () => {
      addUserModal.classList.add('hidden');
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
      if (e.target === addUserModal) {
        addUserModal.classList.add('hidden');
      }
    });
  </script>
</body>
</html>