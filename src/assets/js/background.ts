import { isValidUrlHandler } from "./helpers/base";
import { storeValue } from "./helpers/storage";

// Event listener for when the service worker is installed
chrome.runtime.onInstalled.addListener(() => {
  storeValue("allowIgnore", true);
});

// Event listener for handling messages from the content script
chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.type === "CHECK_URL") {
    const url = message.url;
    const valid = await isValidUrlHandler({ url });

    if (!valid) {
      // Redirect the user to a different page
      // @ts-ignore
      chrome.tabs.update(sender?.tab?.id, { url: "/src/blocked.html" });
    }
  }
});
