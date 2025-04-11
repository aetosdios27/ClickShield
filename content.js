chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getLinks") {
      const links = Array.from(document.links).map(link => link.href);
      sendResponse({links: links});
    }
  });