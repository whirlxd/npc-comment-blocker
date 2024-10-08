document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Basic validation
    if (username === "" || password === "") {
      displayError("Username and password cannot be empty.");
      return;
    }

    // Mock authentication (replace with real authentication logic)
    const mockUser = {
      username: "user123",
      password: "pass123",
    };

    if (username === mockUser.username && password === mockUser.password) {
      // Redirect on successful login
      alert("Login successful!");
      window.location.href = "dashboard.html"; // Redirect to a dashboard or home page
    } else {
      displayError("Invalid username or password.");
    }
  });

/**
 * Displays an error message.
 * @param {string} message - The error message to display.
 */
function displayError(message) {
  const errorMessageDiv = document.getElementById("errorMessage");
  errorMessageDiv.textContent = message;
  errorMessageDiv.style.display = "block";
}
