const keywords = [
  "100% music, 0% nudity",
  "Who's here in ",
  "Who's listening to this in ",
  "Like if you're watching this in ",
  "Who's here after watching ",
  "This song never gets old",
  "This brings back memories",
  "This song hits different at 3 am",
  "This is real music, not like today’s trash.",
  "Anyone else getting nostalgic vibes?",
  "This deserves more views/likes!",
  "How many people are still listening to this in [year]?",
  "I’m in [current year], but this song is timeless.",
  "If you're reading this, I hope you have a great day!",
  "Who’s still watching in [year]?",
  "Here before this blows up!",
  "RIP to those who haven’t found this gem yet.",
  "This comment section is a vibe.",
  "This song is a masterpiece, change my mind.",
  "If you're reading this, you're a legend.",
  "Anyone in",
  "You’re a legend if you’re watching this in",
  "Who's listening in",
  "Who's watching in",
  "Who's here in",
  "Who's still listening in",
  "You are allowed to like",
  "Edit: Thanks for the likes!",
  "Edit: I can't believe this blew up!",
  "2021 anyone?",
  "2022 anyone?",
  "2023 anyone?",
  "2024 anyone?",
  "2025 anyone?",
  "2026 anyone?",
  "Edit",
  "I see you scrolling through the comments",
  "You are allowed to like",
  "I am not asking for likes",
  "If you like this comment",
  "If you are reading this",
  "If you don't like this comment",
  "Wow this blew",
  "WHO's Still here",
  "2019 anyone?",
  "  Who else is just randomly listening to some old songs",
  "I'm not asking for likes",
  "0% Porn",
  "100% Music",
  "See you in 2030",
  "The older i get",
  "The worst thing about this song is that it ends",
  "This song is my childhood",
  "This song is my life",
  "This song is my love",
  "This song is my soul",
  "This song is my heart",
  "The worst thing about this",
  "Lets get this to",
];

// Function to create a regex pattern from a keyword
function createPattern(keyword) {
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(escapedKeyword.replace(/\s+/g, "\\s*"), "i");
}

// Function to check if a text contains any of the keywords
function containsKeyword(text) {
  return keywords.some((keyword) => createPattern(keyword).test(text));
}

// Function to check and hide or replace comments
function blockComments(keywords, replaceComments) {
  const comments = document.querySelectorAll("#content-text");
  comments.forEach((comment) => {
    if (containsKeyword(comment.innerText.toLowerCase(), keywords)) {
      if (replaceComments) {
        comment.innerText = "[Blocked Comment]";
      } else {
        comment.closest("ytd-comment-thread-renderer").style.display = "none";
      }
    }
  });
}

// Function to initialize the observer
function initObserver(keywords, replaceComments) {
  const commentsSection = document.querySelector("#comments");
  if (commentsSection) {
    blockComments(keywords, replaceComments);
    const observer = new MutationObserver(() =>
      blockComments(keywords, replaceComments)
    );
    observer.observe(commentsSection, {
      childList: true,
      subtree: true,
    });
  } else {
    console.error("Comments section not found.");
  }
}

// Load keywords and toggle states from storage and run the initObserver function when the page loads
window.addEventListener("load", () => {
  chrome.storage.sync.get(
    ["keywords", "isEnabled", "replaceComments"],
    (data) => {
      const keywords = data.keywords || [];
      const isEnabled = data.isEnabled !== false; // Default to enabled if not set
      const replaceComments = data.replaceComments === true; // Default to remove if not set
      if (isEnabled) {
        setTimeout(() => {
          initObserver(keywords, replaceComments);
        }, 3000);
      } else {
        console.log("NPC Comment Blocker is disabled");
      }
    }
  );
});
