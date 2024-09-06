// Define the array of keywords to block
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

// Function to check and hide comments
function blockComments() {
  const comments = document.querySelectorAll("#content-text");
  comments.forEach((comment) => {
    if (containsKeyword(comment.innerText.toLowerCase())) {
      comment.closest("ytd-comment-thread-renderer").style.display = "none";
    }
  });
}

// Function to initialize the observer
function initObserver() {
  const commentsSection = document.querySelector("#comments");
  if (commentsSection) {
    blockComments();
    const observer = new MutationObserver(blockComments);
    observer.observe(commentsSection, {
      childList: true,
      subtree: true,
    });
  } else {
    console.error("Comments section not found.");
  }
}

// Run the initObserver function when the page loads
window.addEventListener("load", () => {
  // Delay to ensure comments section is loaded
  setTimeout(() => {
    initObserver();
    console.log(`
 _        _______  _______    _______  _______  _______  _______  _______  _       _________ _______    ______   _        _______  _______  _        _______  ______  
( (    /|(  ____ )(  ____ \  (  ____ \(  ___  )(       )(       )(  ____ \( (    /|\__   __/(  ____ \  (  ___ \ ( \      (  ___  )(  ____ \| \    /\(  ____ \(  __  \ 
|  \  ( || (    )|| (    \/  | (    \/| (   ) || () () || () () || (    \/|  \  ( |   ) (   | (    \/  | (   ) )| (      | (   ) || (    \/|  \  / /| (    \/| (  \  )
|   \ | || (____)|| |        | |      | |   | || || || || || || || (__    |   \ | |   | |   | (_____   | (__/ / | |      | |   | || |      |  (_/ / | (__    | |   ) |
| (\ \) ||  _____)| |        | |      | |   | || |(_)| || |(_)| ||  __)   | (\ \) |   | |   (_____  )  |  __ (  | |      | |   | || |      |   _ (  |  __)   | |   | |
| | \   || (      | |        | |      | |   | || |   | || |   | || (      | | \   |   | |         ) |  | (  \ \ | |      | |   | || |      |  ( \ \ | (      | |   ) |
| )  \  || )      | (____/\  | (____/\| (___) || )   ( || )   ( || (____/\| )  \  |   | |   /\____) |  | )___) )| (____/\| (___) || (____/\|  /  \ \| (____/\| (__/  )
|/    )_)|/       (_______/  (_______/(_______)|/     \||/     \|(_______/|/    )_)   )_(   \_______)  |/ \___/ (_______/(_______)(_______/|_/    \/(_______/(______/ 
                                                                                                                                                                      
`);
  }, 3000);
});
