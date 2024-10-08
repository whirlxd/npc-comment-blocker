chrome.runtime.onInstalled.addListener(() => {
  console.log("NPC Comment Blocker Extension Installed");
});

// Function to get OAuth2 token
function getAuthTokenInteractive() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(token);
      }
    });
  });
}

// Function to revoke token
function revokeToken(token) {
  return fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`, {
    method: "POST",
    mode: "no-cors",
  })
    .then(() => {
      console.log("Token revoked successfully.");
    })
    .catch((error) => {
      console.error("Error revoking token:", error);
    });
}

// Listener for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "login") {
    getAuthTokenInteractive()
      .then((token) => {
        sendResponse({ success: true, token });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // Indicates that the response is asynchronous
  }

  if (request.action === "logout") {
    chrome.identity.getAuthToken({ interactive: false }, (token) => {
      if (token) {
        revokeToken(token).then(() => {
          chrome.identity.removeCachedAuthToken({ token }, () => {
            sendResponse({ success: true });
          });
        });
      } else {
        sendResponse({ success: false, error: "No token found" });
      }
    });
    return true;
  }
});
