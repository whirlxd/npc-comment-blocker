const keywords = [
  // Your list of keywords goes here...
  "Best",
  "100% music, 0% nudity",
  // Add more keywords as needed...
];

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
    "\\$&"
  );
  return new RegExp(`\\b${escapedPattern.replace(/\s+/g, "\\s*")}\\b`, "i");
}

/**
 * Checks if a text contains any of the keywords.
 * @param {string} text - The text to check.
 * @returns {boolean} - True if the text contains any of the keywords, false otherwise.
 */
function containsKeyword(text) {
  return keywords.some((keyword) => createPattern(keyword).test(text));
}

/**
 * Checks and hides or replaces comments that contain any of the keywords.
 * @param {boolean} replaceComments - Whether to replace comments with "[Blocked Comment]" or hide them.
 */
function blockComments(replaceComments) {
  const comments = document.querySelectorAll("#content-text");
  comments.forEach((comment) => {
    if (containsKeyword(comment.innerText.toLowerCase())) {
      if (replaceComments) {
        comment.innerText = "[Blocked Comment]";
      } else {
        comment.closest("ytd-comment-thread-renderer").style.display = "none";
      }
    }
  });
}

/**
 * Initializes the observer to monitor and block comments.
 * @param {boolean} replaceComments - Whether to replace comments with "[Blocked Comment]" or hide them.
 */
function initObserver(replaceComments) {
  const commentsSection = document.querySelector("#comments");
  if (commentsSection) {
    blockComments(replaceComments);
    const observer = new MutationObserver(() => blockComments(replaceComments));
    observer.observe(commentsSection, {
      childList: true,
      subtree: true,
    });
  } else {
    console.error("Comments section not found.");
  }
}

/**
 * Loads keywords and toggle states from storage and initializes the observer when the page loads.
 */
window.addEventListener("load", () => {
  chrome.storage.sync.get(["isEnabled", "replaceComments"], (data) => {
    const isEnabled = data.isEnabled !== false; // Default to enabled if not set
    const replaceComments = data.replaceComments === true; // Default to remove if not set
    if (isEnabled) {
      setTimeout(() => {
        initObserver(replaceComments);
      }, 3000);
    } else {
      console.log("NPC Comment Blocker is disabled");
    }
  });
});
