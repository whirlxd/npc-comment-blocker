document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("login-button");
  const logoutButton = document.getElementById("logout-button");
  const userInfo = document.getElementById("user-info");
  const userNameSpan = document.getElementById("user-name");

  // Function to check if user is already authenticated
  function checkAuthentication() {
    chrome.identity.getProfileUserInfo((userInfoData) => {
      if (userInfoData.email) {
        // User is authenticated
        loginButton.style.display = "none";
        logoutButton.style.display = "block";
        userInfo.style.display = "block";
        userNameSpan.textContent = userInfoData.email;
      } else {
        // User is not authenticated
        loginButton.style.display = "block";
        logoutButton.style.display = "none";
        userInfo.style.display = "none";
      }
    });
  }

  // Initial check
  checkAuthentication();

  // Handle login
  loginButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "login" }, (response) => {
      if (response.success) {
        checkAuthentication();
      } else {
        alert("Authentication failed: " + response.error);
      }
    });
  });

  // Handle logout
  logoutButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "logout" }, (response) => {
      if (response.success) {
        checkAuthentication();
      } else {
        alert("Logout failed: " + response.error);
      }
    });
  });

  // Save Replace Text
  document.getElementById("save").addEventListener("click", () => {
    const replaceText = document.getElementById("keywords").value.trim();
    if (!replaceText) {
      alert("Please enter replacement text.");
      return;
    }

    chrome.identity.getProfileUserInfo((userInfoData) => {
      const userEmail = userInfoData.email || "default";
      chrome.storage
