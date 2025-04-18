<?php
// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Database connection parameters
$host = 'localhost';
$dbname = 'logitrack';
$username = 'root';
$password = '';

try {
    // Create a new PDO instance
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get search parameters
    $searchType = isset($_GET['type']) ? $_GET['type'] : '';
    $searchValue = isset($_GET['value']) ? $_GET['value'] : '';

    // Validate search parameters
    if (empty($searchType) || empty($searchValue)) {
        echo json_encode([
            'success' => false,
            'message' => 'Search type and value are required'
        ]);
        exit;
    }

    // Prepare the query based on search type
    if ($searchType === 'order') {
        $query = "
            SELECT 
                o.order_id,
                o.order_number,
                o.purchase_date,
                o.total_amount,
                o.status as order_status,
                s.shipment_id,
                s.tracking_number,
                s.delivery_charges,
                s.status as shipment_status,
                p.product_id,
                p.name as product_name,
                p.mrp as product_mrp,
                oi.quantity,
                oi.price as item_price,
                u.username,
                a.street_address,
                a.city,
                a.state,
                a.zip_code,
                a.country
            FROM 
                orders o
            JOIN 
                order_items oi ON o.order_id = oi.order_id
            JOIN 
                products p ON oi.product_id = p.product_id
            JOIN 
                users u ON o.user_id = u.user_id
            JOIN 
                addresses a ON u.user_id = a.user_id
            LEFT JOIN 
                shipments s ON o.order_id = s.order_id
            WHERE 
                o.order_number = :search_value
            AND 
                a.is_default = 1
            LIMIT 1
        ";
    } else if ($searchType === 'tracking') {
        $query = "
            SELECT 
                o.order_id,
                o.order_number,
                o.purchase_date,
                o.total_amount,
                o.status as order_status,
                s.shipment_id,
                s.tracking_number,
                s.delivery_charges,
                s.status as shipment_status,
                p.product_id,
                p.name as product_name,
                p.mrp as product_mrp,
                oi.quantity,
                oi.price as item_price,
                u.username,
                a.street_address,
                a.city,
                a.state,
                a.zip_code,
                a.country
            FROM 
                shipments s
            JOIN 
                orders o ON s.order_id = o.order_id
            JOIN 
                order_items oi ON o.order_id = oi.order_id
            JOIN 
                products p ON oi.product_id = p.product_id
            JOIN 
                users u ON o.user_id = u.user_id
            JOIN 
                addresses a ON u.user_id = a.user_id
            WHERE 
                s.tracking_number = :search_value
            AND 
                a.is_default = 1
            LIMIT 1
        ";
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid search type'
        ]);
        exit;
    }

    // Prepare and execute the query
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':search_value', $searchValue);
    $stmt->execute();

    // Fetch the result
    $shipment = $stmt->fetch(PDO::FETCH_ASSOC);

    // If no shipment found
    if (!$shipment) {
        echo json_encode([
            'success' => false,
            'message' => 'Shipment not found'
        ]);
        exit;
    }

    // Get shipment tracking timeline
    $timelineQuery = "
        SELECT 
            status,
            location,
            description,
            tracking_date
        FROM 
            shipment_tracking
        WHERE 
            shipment_id = :shipment_id
        ORDER BY 
            tracking_date ASC
    ";

    $timelineStmt = $pdo->prepare($timelineQuery);
    $timelineStmt->bindParam(':shipment_id', $shipment['shipment_id']);
    $timelineStmt->execute();

    $timeline = $timelineStmt->fetchAll(PDO::FETCH_ASSOC);

    // Format the response
    $response = [
        'success' => true,
        'shipment' => [
            'id' => $shipment['order_number'],
            'trackingId' => $shipment['tracking_number'],
            'purchaseDate' => date('M d, Y', strtotime($shipment['purchase_date'])),
            'deliveryCharges' => '$' . number_format($shipment['delivery_charges'], 2),
            'productMRP' => '$' . number_format($shipment['product_mrp'], 2),
            'totalAmount' => '$' . number_format($shipment['total_amount'], 2),
            'status' => $shipment['shipment_status'],
            'product' => [
                'name' => $shipment['product_name'],
                'quantity' => $shipment['quantity']
            ],
            'address' => [
                'street' => $shipment['street_address'],
                'city' => $shipment['city'],
                'state' => $shipment['state'],
                'zipCode' => $shipment['zip_code'],
                'country' => $shipment['country']
            ],
            'timeline' => []
        ]
    ];

    // Add timeline events
    foreach ($timeline as $event) {
        $response['shipment']['timeline'][] = [
            'date' => date('M d, Y', strtotime($event['tracking_date'])),
            'content' => $event['description'],
            'location' => $event['location']
        ];
    }

    // Return the response
    echo json_encode($response);
} catch (PDOException $e) {
    // Handle database errors
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
