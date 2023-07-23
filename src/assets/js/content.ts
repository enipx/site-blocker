// Get the current URL
const currentUrl = window.location.href;

// Send the URL to the background script
chrome.runtime.sendMessage({ type: "CHECK_URL", url: currentUrl });
