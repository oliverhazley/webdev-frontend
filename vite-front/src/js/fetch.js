// src/js/fetch.js
const BASE_URL = 'http://localhost:3000/api';

export const apiRequest = async (endpoint, method = 'GET', data = null) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: data ? JSON.stringify(data) : undefined,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Unknown error');
        }

        const result = await response.json();
        showSnackbar(result.message || 'Request successful');
        return result;
    } catch (error) {
        console.error('API Error:', error.message);
        showSnackbar(error.message);
        throw error;
    }
};

export const showSnackbar = (message) => {
    let snackbar = document.getElementById('snackbar');

    // Create the snackbar
    if (!snackbar) {
        snackbar = document.createElement('div');
        snackbar.id = 'snackbar';
        document.body.appendChild(snackbar);
    }

    // Set the message and show the snackbar
    snackbar.textContent = message;
    snackbar.className = 'show';

    // Automatically hide the snackbar after 3 seconds
    setTimeout(() => {
        snackbar.className = snackbar.className.replace('show', '');
    }, 3000);
};
