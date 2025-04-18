// shared-data.js
// This file provides functions to handle global data storage and retrieval

// Function to get global search history
function getGlobalSearchHistory() {
    try {
        return JSON.parse(localStorage.getItem('globalSearchHistory') || '[]');
    } catch (error) {
        console.error('Error retrieving global search history:', error);
        return [];
    }
}

// Function to save to global search history
function saveToGlobalSearchHistory(historyEntry) {
    try {
        const searchHistory = getGlobalSearchHistory();

        // Check if already exists
        const existingIndex = searchHistory.findIndex(item =>
            item.searchValue === historyEntry.searchValue &&
            item.searchType === historyEntry.searchType
        );

        if (existingIndex !== -1) {
            searchHistory.splice(existingIndex, 1);
        }

        // Add to beginning of array
        searchHistory.unshift(historyEntry);

        // Keep only last 20 items
        if (searchHistory.length > 20) {
            searchHistory.pop();
        }

        localStorage.setItem('globalSearchHistory', JSON.stringify(searchHistory));
        return true;
    } catch (error) {
        console.error('Error saving to global search history:', error);
        return false;
    }
}

// Function to get mock orders data
function getMockOrders() {
    return {
        'order': {
            'NYK-247761089-1926200': {
                status: 'processing',
                total_amount: 1876.00,
                order_date: '2023-12-30',
                customer: {
                    name: 'Khushi Thakur',
                    address: '01 Village Patera',
                    city: 'Bhota',
                    state: 'Himachal Pradesh',
                    postal_code: '177401',
                    phone: '9015189448'
                },
                shipments: [
                    {
                        number: 1,
                        total_shipments: 2,
                        amount: 284.00,
                        items_count: 1,
                        status: 'delivered',
                        tracking_id: 'TRK-123789'
                    }
                ]
            },
            '404-9351544-7478729': {
                status: 'processing',
                total_amount: 399.00,
                order_date: '2025-04-10',
                customer: {
                    name: 'Prashant Rana',
                    address: 'Boys Hostel 4, Block 51, Lovely Professional University',
                    city: 'Jalandhar',
                    state: 'Punjab',
                    postal_code: '144411',
                    phone: '9876543210'
                },
                shipments: [
                    {
                        number: 1,
                        total_shipments: 1,
                        amount: 399.00,
                        items_count: 1,
                        status: 'processing',
                        tracking_id: 'TRK-987654'
                    }
                ]
            },
            '404-4356617-4379543': {
                status: 'processing',
                total_amount: 268.00,
                order_date: '2025-04-10',
                customer: {
                    name: 'Prashant Rana',
                    address: 'Boys Hostel 4, Block 51, Lovely Professional University, Delhi Gt Road',
                    city: 'Jalandhar',
                    state: 'Punjab',
                    postal_code: '144411',
                    phone: '9876543210'
                },
                shipments: [
                    {
                        number: 1,
                        total_shipments: 1,
                        amount: 268.00,
                        items_count: 1,
                        status: 'processing',
                        tracking_id: 'TRK-456789'
                    }
                ]
            },
            'ORD-123456': { status: 'delivered' },
            'ORD-654321': { status: 'processing' }
        },
        'tracking': {
            'TRK-123789': {
                order_id: 'NYK-247761089-1926200',
                status: 'delivered',
                shipment_number: 1,
                amount: 284.00
            },
            'TRK-987654': {
                order_id: '404-9351544-7478729',
                status: 'processing',
                shipment_number: 1,
                amount: 399.00
            },
            'TRK-456789': {
                order_id: '404-4356617-4379543',
                status: 'processing',
                shipment_number: 1,
                amount: 268.00
            },
            'TRK-123456': { status: 'delivered' },
            'TRK-789012': { status: 'processing' },
            'TRK-345678': { status: 'delivered' }
        }
    };
}

// Function to get shipment details by ID and type
function getShipmentDetails(searchId, searchType) {
    const mockOrders = getMockOrders();

    let shipmentDetails;
    if (searchType === 'tracking') {
        const trackingInfo = mockOrders['tracking'][searchId];
        if (trackingInfo) {
            shipmentDetails = mockOrders['order'][trackingInfo.order_id];
        }
    } else {
        shipmentDetails = mockOrders['order'][searchId];
    }

    return shipmentDetails;
}

// Export functions for use in other files
window.LogiTrackShared = {
    getGlobalSearchHistory,
    saveToGlobalSearchHistory,
    getMockOrders,
    getShipmentDetails
}; 