<?php
session_start();
require_once 'config.php';
header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

// Get JSON data
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['newUsername']) || empty(trim($data['newUsername']))) {
    echo json_encode(['success' => false, 'message' => 'Username is required']);
    exit;
}

$newUsername = trim($data['newUsername']);
$user_id = $_SESSION['user_id'];

// Check if username is already taken
$stmt = $conn->prepare("SELECT id FROM users WHERE username = ? AND id != ?");
$stmt->bind_param("si", $newUsername, $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Username is already taken']);
    exit;
}

// Update username
$stmt = $conn->prepare("UPDATE users SET username = ? WHERE id = ?");
$stmt->bind_param("si", $newUsername, $user_id);

if ($stmt->execute()) {
    $_SESSION['username'] = $newUsername;
    echo json_encode(['success' => true, 'message' => 'Username updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update username']);
}

$stmt->close();
$conn->close();
