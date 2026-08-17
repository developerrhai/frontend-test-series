// config.js - Single place for API base URL. All fetch("/api/...") calls use this automatically.
const CONFIG = {
    API_BASE_URL: "http://13.204.199.132:5000", // EC2 Production IP
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