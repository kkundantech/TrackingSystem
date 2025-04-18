document.addEventListener('DOMContentLoaded', function () {
    // Load initial shipments
    loadShipments();

    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const searchType = document.getElementById('searchType');

    searchBtn.addEventListener('click', function () {
        const searchValue = searchInput.value.trim();
        const type = searchType.value;

        if (searchValue) {
            searchShipments(type, searchValue);
        }
    });

    // Modal functionality
    const usernameModal = document.getElementById('usernameModal');
    const passwordModal = document.getElementById('passwordModal');
    const changeUsernameBtn = document.getElementById('changeUsername');
    const changePasswordBtn = document.getElementById('changePassword');
    const closeButtons = document.getElementsByClassName('close');

    changeUsernameBtn.addEventListener('click', function () {
        usernameModal.style.display = 'block';
    });

    changePasswordBtn.addEventListener('click', function () {
        passwordModal.style.display = 'block';
    });

    Array.from(closeButtons).forEach(button => {
        button.addEventListener('click', function () {
            usernameModal.style.display = 'none';
            passwordModal.style.display = 'none';
        });
    });

    window.addEventListener('click', function (event) {
        if (event.target == usernameModal) {
            usernameModal.style.display = 'none';
        }
        if (event.target == passwordModal) {
            passwordModal.style.display = 'none';
        }
    });

    // Form submissions
    const changeUsernameForm = document.getElementById('changeUsernameForm');
    const changePasswordForm = document.getElementById('changePasswordForm');

    changeUsernameForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const newUsername = this.newUsername.value.trim();

        try {
            const response = await fetch('php/update_username.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newUsername })
            });

            const data = await response.json();

            if (data.success) {
                alert('Username updated successfully!');
                usernameModal.style.display = 'none';
                location.reload();
            } else {
                alert(data.message || 'Failed to update username');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    });

    changePasswordForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const oldPassword = this.oldPassword.value;
        const newPassword = this.newPassword.value;
        const confirmPassword = this.confirmPassword.value;

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        try {
            const response = await fetch('php/update_password.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ oldPassword, newPassword })
            });

            const data = await response.json();

            if (data.success) {
                alert('Password updated successfully!');
                passwordModal.style.display = 'none';
                this.reset();
            } else {
                alert(data.message || 'Failed to update password');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    });
});

// Function to load all shipments
async function loadShipments() {
    const shipmentsList = document.getElementById('shipmentsList');
    const loadingSpinner = document.getElementById('loadingSpinner');

    loadingSpinner.style.display = 'flex';

    try {
        const response = await fetch('php/get_shipments.php');
        const data = await response.json();

        if (data.success) {
            displayShipments(data.shipments);
        } else {
            shipmentsList.innerHTML = '<p>No shipments found.</p>';
        }
    } catch (error) {
        console.error('Error:', error);
        shipmentsList.innerHTML = '<p>Error loading shipments. Please try again later.</p>';
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

// Function to search shipments
async function searchShipments(type, value) {
    const shipmentsList = document.getElementById('shipmentsList');
    const loadingSpinner = document.getElementById('loadingSpinner');

    loadingSpinner.style.display = 'flex';

    try {
        const response = await fetch('php/search_shipments.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type, value })
        });

        const data = await response.json();

        if (data.success) {
            displayShipments(data.shipments);
        } else {
            shipmentsList.innerHTML = '<p>No shipments found.</p>';
        }
    } catch (error) {
        console.error('Error:', error);
        shipmentsList.innerHTML = '<p>Error searching shipments. Please try again later.</p>';
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

// Function to display shipments
function displayShipments(shipments) {
    const shipmentsList = document.getElementById('shipmentsList');

    if (shipments.length === 0) {
        shipmentsList.innerHTML = '<p>No shipments found.</p>';
        return;
    }

    const shipmentsHTML = shipments.map(shipment => `
        <div class="shipment-card">
            <div class="shipment-header">
                <h3>Tracking ID: ${shipment.tracking_id}</h3>
                <span class="status ${shipment.status.toLowerCase()}">${shipment.status}</span>
            </div>
            <div class="shipment-details">
                <p><strong>Origin:</strong> ${shipment.origin}</p>
                <p><strong>Destination:</strong> ${shipment.destination}</p>
                <p><strong>Last Updated:</strong> ${new Date(shipment.updated_at).toLocaleString()}</p>
            </div>
        </div>
    `).join('');

    shipmentsList.innerHTML = shipmentsHTML;
} 