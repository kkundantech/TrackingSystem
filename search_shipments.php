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

if (
    !isset($data['type']) || !isset($data['value']) ||
    empty($data['type']) || empty($data['value'])
) {
    echo json_encode(['success' => false, 'message' => 'Search type and value are required']);
    exit;
}

$type = $data['type'];
$value = trim($data['value']);
$user_id = $_SESSION['user_id'];

// Prepare search query based on type
if ($type === 'tracking') {
    $stmt = $conn->prepare("SELECT * FROM parcels WHERE user_id = ? AND tracking_id = ?");
    $stmt->bind_param("is", $user_id, $value);
} else {
    // For order ID, we'll use the same field for now
    // In a real application, you might have a separate order_id field
    $stmt = $conn->prepare("SELECT * FROM parcels WHERE user_id = ? AND tracking_id = ?");
    $stmt->bind_param("is", $user_id, $value);
}

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
