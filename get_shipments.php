<?php
session_start();
require_once 'config.php';
header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

$user_id = $_SESSION['user_id'];

// Get user's shipments
$stmt = $conn->prepare("SELECT * FROM parcels WHERE user_id = ? ORDER BY created_at DESC");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$shipments = [];
while ($row = $result->fetch_assoc()) {
    $shipments[] = [
        'id' => $row['id'],
        'tracking_id' => $row['tracking_id'],
        'status' => $row['status'],
        'origin' => $row['origin'],
        'destination' => $row['destination'],
        'created_at' => $row['created_at'],
        'updated_at' => $row['updated_at']
    ];
}

echo json_encode([
    'success' => true,
    'shipments' => $shipments
]);

$stmt->close();
$conn->close();
