const config = {
    api: {
        baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            destinations: '/api/destinations',
            lists: '/api/lists'
        }
    }
};

export default config; 