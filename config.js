// config.js - Single place for API base URL. All fetch("/api/...") calls use this automatically.
const CONFIG = {
    API_BASE_URL: "", 
};

// Reusable function to build full URLs (optional)
function getUrl(endpoint) {
    return `${CONFIG.API_BASE_URL}${endpoint}`;
}

// Override fetch so relative URLs like "/api/auth/login" use API_BASE_URL without changing any existing code
(function () {
    var base = typeof CONFIG !== "undefined" && CONFIG.API_BASE_URL ? CONFIG.API_BASE_URL : "";
    var origFetch = window.fetch;
    window.fetch = function (url, options) {
        if (typeof url === "string" && url.startsWith("/")) {
            url = base + url;
        }
        return origFetch.call(window, url, options);
    };
})();

// Global Error Boundary for Unhandled Fetch Errors
window.addEventListener('unhandledrejection', function(event) {
    console.error("Unhandled Promise Rejection:", event.reason);
    
    // Create a basic toast notification if it doesn't exist
    let toastContainer = document.getElementById('global-toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'global-toast-container';
        toastContainer.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.style.cssText = 'background:#ef4444;color:white;padding:15px 25px;border-radius:8px;box-shadow:0 10px 15px rgba(0,0,0,0.1);font-family:sans-serif;font-size:14px;animation:slideIn 0.3s ease-out forwards;';
    
    const msg = event.reason && event.reason.message ? event.reason.message : "A network or server error occurred.";
    toast.innerHTML = `<strong>Error:</strong> ${msg}`;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
});

// Add animation keyframes if not present
if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.innerHTML = `@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
    document.head.appendChild(style);
}