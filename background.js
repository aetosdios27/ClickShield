console.log("ClickShield service worker loaded");

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "scanLink",
    title: "Scan with ClickShield",
    contexts: ["link"]
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "scanLink") {
    checkUrlSafety(info.linkUrl).then(isUnsafe => {
      alert(isUnsafe ? "⚠️ This link is potentially harmful!" : "✅ This link is safe.");
    });
  }
});

async function checkUrlSafety(url) {
  const API_KEY = "YOUR_GOOGLE_SAFE_BROWSING_API_KEY";
  const body = {
    client: { clientId: "ClickShield", clientVersion: "1.0.0" },
    threatInfo: {
      threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "POTENTIALLY_HARMFUL_APPLICATION"],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url }]
    }
  };

  const res = await fetch("https://safebrowsing.googleapis.com/v4/threatMatches:find?key=" + API_KEY, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" }
  });

  const data = await res.json();
  return !!data.matches;
}
