/**
 * Simple API client for the Azure-hosted Wellness Hub
 */

const isProduction = import.meta.env.MODE === 'production';
const API_BASE = isProduction ? '' : 'http://localhost:5173'; // ASWA proxies /api to the Functions dev server

export const apiClient = {
    async post(endpoint, data) {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API request failed');
        }

        return await response.json();
    },

    async get(endpoint) {
        const response = await fetch(`${API_BASE}${endpoint}`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API request failed');
        }
        return await response.json();
    }
};
