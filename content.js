/**
 * Fetches keywords from the server via the background script.
 * @returns {Promise<Array<string>>} - A promise that resolves to an array of keywords.
 */
function fetchKeywords() {
	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage({ action: "fetchKeywords" }, (response) => {
			if (response.error) {
				reject(response.error);
			} else {
				resolve(response.keywords);
			}
		});
	});
}

/**
 * Replaces placeholders in a keyword with regex patterns.
 * @param {string} keyword - The keyword containing placeholders.
 * @returns {string} - The keyword with placeholders replaced by regex patterns.
 */
function replacePlaceholders(keyword) {
	return keyword
		.replace(/\[year\]/g, "(20\\d{2})")
		.replace(/\[month\]/g, "(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)");
}

/**
 * Creates a regex pattern from a keyword.
 * @param {string} keyword - The keyword to create a regex pattern from.
 * @returns {RegExp} - The regex pattern.
 */
function createPattern(keyword) {
	const patternWithPlaceholders = replacePlaceholders(keyword);
	const escapedPattern = patternWithPlaceholders.replace(
		/[.*+?^${}()|[\]\\]/g,
		"\\$&",
	);
	return new RegExp(`\\b${escapedPattern.replace(/\s+/g, "\\s*")}\\b`, "i");
}

/**
 * Checks if a text contains any of the keywords.
 * @param {string} text - The text to check.
 * @param {Array<string>} keywords - The list of keywords to check against.
 * @returns {boolean} - True if the text contains any of the keywords, false otherwise.
 */
function containsKeyword(text, keywords) {
	return keywords.some((keyword) => createPattern(keyword).test(text));
}

/**
 * Checks and hides or replaces comments that contain any of the keywords.
 * @param {Array<string>} keywords - The list of keywords to check against.
 * @param {boolean} replaceComments - Whether to replace comments with "[Blocked Comment]" or hide them.
 * @param {string} customReplaceWord - The custom word to replace comments with.
 */
function blockComments(keywords, replaceComments, customReplaceWord) {
	const comments = document.querySelectorAll("#content-text");
	// biome-ignore lint/complexity/noForEach: <explanation>
	comments.forEach((comment) => {
		if (containsKeyword(comment.innerText.toLowerCase(), keywords)) {
			if (replaceComments) {
				comment.innerText = customReplaceWord || "[Blocked Comment]";
			} else {
				comment.closest("ytd-comment-thread-renderer").style.display = "none";
			}
		}
	});
}

/**
 * Initializes the observer to monitor and block comments.
 * @param {boolean} replaceComments - Whether to replace comments with "[Blocked Comment]" or hide them.
 * @param {string} replaceWord - The custom word to replace comments with.
 */
async function initObserver(replaceComments, replaceWord) {
	const commentsSection = document.querySelector("#comments");
	if (commentsSection) {
		try {
			const keywords = await fetchKeywords();
			blockComments(keywords, replaceComments, replaceWord);
			const observer = new MutationObserver(() =>
				blockComments(keywords, replaceComments, replaceWord),
			);
			observer.observe(commentsSection, {
				childList: true,
				subtree: true,
			});
		} catch (error) {
			console.error("Failed to initialize observer:", error);
		}
	} else {
		console.error("Comments section not found.");
	}
}

/**
 * Loads keywords and toggle states from storage and initializes the observer when the page loads.
 */
window.addEventListener("load", () => {
	browser.storage.sync.get(
		["isEnabled", "replaceComments", "replaceWord"],
		async (data) => {
			const replaceWord = data.replaceWord || "[Blocked Comment]";
			const isEnabled = data.isEnabled !== false; // Default to enabled if not set
			const replaceComments = data.replaceComments === true; // Default to remove if not set
			if (isEnabled) {
				setTimeout(async () => {
					await initObserver(replaceComments, replaceWord);
				}, 3000);
			} else {
				console.log("NPC Comment Blocker is disabled");
			}
		},
	);
});

// Listen for changes in storage and reapply the comment blocking logic
browser.storage.onChanged.addListener(async (changes, area) => {
	if (area === "sync") {
		browser.storage.sync.get(
			["isEnabled", "replaceComments", "replaceWord"],
			async (data) => {
				const replaceWord = data.replaceWord || "[Blocked Comment]";
				const isEnabled = data.isEnabled !== false; // Default to enabled if not set
				const replaceComments = data.replaceComments === true; // Default to remove if not set
				if (isEnabled) {
					try {
						const keywords = await fetchKeywords();
						blockComments(keywords, replaceComments, replaceWord);
					} catch (error) {
						console.error("Failed to fetch keywords:", error);
					}
				} else {
					console.log("NPC Comment Blocker is disabled");
				}
			},
		);
	}
});
