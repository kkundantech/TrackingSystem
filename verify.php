<?php
require_once 'config.php';

if (isset($_GET['token'])) {
    $token = $_GET['token'];

    // Prepare a select statement
    $stmt = $conn->prepare("SELECT id FROM users WHERE verification_token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();

        // Update user to remove verification token
        $update_stmt = $conn->prepare("UPDATE users SET verification_token = NULL WHERE id = ?");
        $update_stmt->bind_param("i", $user['id']);

        if ($update_stmt->execute()) {
            echo "Email verification successful! You can now <a href='index.html'>login</a> to your account.";
        } else {
            echo "Error verifying email. Please try again later.";
        }

        $update_stmt->close();
    } else {
        echo "Invalid verification token.";
    }

    $stmt->close();
} else {
    echo "No verification token provided.";
}

$conn->close();
