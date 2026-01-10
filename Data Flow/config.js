// Application Configuration
const AppConfig = {
    appName: 'DataFlow Pro',
    version: '1.0.0',
    environment: 'production',
    
    // API Configuration (Demo - Not Connected)
    api: {
        baseUrl: 'https://api.dataflowpro.com',
        timeout: 30000,
        endpoints: {
            transactions: '/api/v1/transactions',
            users: '/api/v1/users',
            analytics: '/api/v1/analytics',
            reports: '/api/v1/reports'
        }
    },
    
    // UI Configuration
    ui: {
        itemsPerPage: 10,
        chartRefreshInterval: 60000, // 1 minute
        animationDuration: 300,
        searchDebounceTime: 300
    },
    
    // Chart Configuration
    charts: {
        colors: {
            primary: '#667eea',
            secondary: '#764ba2',
            success: '#48bb78',
            warning: '#ed8936',
            danger: '#f56565',
            info: '#4299e1'
        },
        defaultType: 'line',
        responsive: true
    },
    
    // Feature Flags
    features: {
        darkMode: true,
        notifications: true,
        export: true,
        advancedFilters: true,
        realTimeUpdates: false // Requires WebSocket connection
    },
    
    // Data Configuration
    data: {
        cacheEnabled: true,
        cacheExpiration: 300000, // 5 minutes
        localStoragePrefix: 'dataflow_'
    }
};

// Utility to get config value
function getConfig(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], AppConfig);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppConfig;
}