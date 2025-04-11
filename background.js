const API_KEY = "AIzaSyAq3UDlpOK4O03N6zh7qvkSUSDjlZP2yfg"; // Get from https://console.cloud.google.com

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scan") {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "getLinks"}, (response) => {
        checkLinks(response.links).then(result => sendResponse(result));
      });
    });
    return true; // Keep message channel open
  }
});

async function checkLinks(urls) {
  const API_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;
  
  const body = {
    client: { clientId: "clickshield", clientVersion: "1.0" },
    threatInfo: {
      threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: urls.map(url => ({url}))
    }
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    return {
      safe: !data.matches,
      badLinks: data.matches?.map(match => match.threat.url) || []
    };
  } catch (error) {
    return {safe: true, badLinks: []};
  }
}