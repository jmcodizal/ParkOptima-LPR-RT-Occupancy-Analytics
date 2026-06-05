<?php
/**
 * ParkOptima Entry Point
 * This file is kept in the system to handle server-side entry.
 * As requested, the "first process" (landing page UI) is skipped
 * to go directly to the login interface.
 */

// Redirect to the owner login page to skip the landing process
header("Location: owner.php");
exit();
?>