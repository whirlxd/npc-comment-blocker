// document.getElementById("save").addEventListener("click", () => {
//   const keywords = document
//     .getElementById("keywords")
//     .value.split(",")
//     .map((kw) => kw.trim().toLowerCase());
//   chrome.storage.sync.set({ keywords }, () => {
//     alert("Keywords saved!");
//   });
// });

document.getElementById("toggle").addEventListener("change", (event) => {
  const isEnabled = event.target.checked;
  chrome.storage.sync.set({ isEnabled }, () => {
    console.log("Extension state saved:", isEnabled);
  });
});

// Load the current state of the toggle
chrome.storage.sync.get("isEnabled", (data) => {
  document.getElementById("toggle").checked = data.isEnabled !== false; // Default to enabled if not set
});
