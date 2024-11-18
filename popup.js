document.getElementById("save").addEventListener("click", () => {
	const replaceWord = document.getElementById("keywords").value.trim();
	chrome.storage.sync.set({ replaceWord }, () => {
		alert("Custom replace word saved!");
	});
});

document.getElementById("toggle").addEventListener("change", (event) => {
	const isEnabled = event.target.checked;
	chrome.storage.sync.set({ isEnabled }, () => {
		console.log("Extension state saved:", isEnabled);
	});
});

document
	.getElementById("replace-toggle")
	.addEventListener("change", (event) => {
		const replaceComments = event.target.checked;
		chrome.storage.sync.set({ replaceComments }, () => {
			console.log("Replace comments state saved:", replaceComments);
		});
	});

// Load the current state of the toggles
chrome.storage.sync.get(
	["isEnabled", "replaceComments", "replaceWord"],
	(data) => {
		document.getElementById("toggle").checked = data.isEnabled !== false; // Default to enabled if not set
		document.getElementById("replace-toggle").checked =
			data.replaceComments === true; // Default to remove if not set
		document.getElementById("keywords").value =
			data.replaceWord || "[Blocked Comment]";
	},
);
