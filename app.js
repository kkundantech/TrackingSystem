document.addEventListener('DOMContentLoaded', function () {
    // Get elements
    const welcomeScreen = document.getElementById('welcome-screen');
    const signInForm = document.querySelector('.sign-in-form');
    const signUpForm = document.querySelector('.sign-up-form');
    const showSignInBtn = document.getElementById('show-signin-btn');
    const showSignUpBtn = document.getElementById('show-signup-btn');
    const backToWelcomeBtn = document.getElementById('back-to-welcome');
    const backToWelcomeBtn2 = document.getElementById('back-to-welcome-2');

    // Check if user is already logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        window.location.href = "dashboard.html";
    }

    // Show sign-in form
    showSignInBtn.addEventListener('click', function () {
        welcomeScreen.style.display = 'none';
        signInForm.style.display = 'flex';
    });

    // Show sign-up form
    showSignUpBtn.addEventListener('click', function () {
        welcomeScreen.style.display = 'none';
        signUpForm.style.display = 'flex';
    });

    // Back to welcome screen from sign-in
    backToWelcomeBtn.addEventListener('click', function () {
        signInForm.style.display = 'none';
        welcomeScreen.style.display = 'flex';
    });

    // Back to welcome screen from sign-up
    backToWelcomeBtn2.addEventListener('click', function () {
        signUpForm.style.display = 'none';
        welcomeScreen.style.display = 'flex';
    });

    // Form submission handling
    document.querySelector(".sign-in-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('login');
        const password = formData.get('password');

        // Simple validation
        if (!email || !password) {
            alert("Email and password are required");
            return;
        }

        // Check if user exists in localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // User exists and credentials are correct
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('userEmail', email);
            sessionStorage.setItem('username', user.username);

            // Redirect to dashboard
            window.location.href = "dashboard.html";
        } else {
            // Check if email exists but password is wrong
            const emailExists = users.some(u => u.email === email);
            if (emailExists) {
                alert("Incorrect password. Please try again.");
            } else {
                alert("Account not found. Please create an account first.");
                // Show sign-up form
                signInForm.style.display = 'none';
                signUpForm.style.display = 'flex';
            }
        }
    });

    document.querySelector(".sign-up-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');

        // Simple validation
        if (!username || !email || !password) {
            alert("Username, email and password are required");
            return;
        }

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userExists = users.some(u => u.email === email);

        if (userExists) {
            alert("An account with this email already exists. Please log in instead.");
            // Show sign-in form
            signUpForm.style.display = 'none';
            signInForm.style.display = 'flex';
        } else {
            // Create new user
            users.push({ username, email, password });
            localStorage.setItem('users', JSON.stringify(users));

            // Log the user in
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('userEmail', email);
            sessionStorage.setItem('username', username);

            // Redirect to dashboard
            window.location.href = "dashboard.html";
        }
    });
}); 