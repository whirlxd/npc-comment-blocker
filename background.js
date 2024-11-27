chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "fetchKeywords") {
		fetch("http://localhost:3000/keywords")
			.then((response) => response.json())
			.then((data) => {
				sendResponse({ keywords: data.keywords });
			})
			.catch((error) => {
				console.error("Failed to fetch keywords:", error);
				sendResponse({ error: "Failed to fetch keywords" });
			});
		return true; // Will respond asynchronously.
	}
});
