document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.runtime.sendMessage({action: "scan"}, (response) => {
        const resultDiv = document.getElementById('result');
        if (response.safe) {
          resultDiv.innerHTML = "✅ All links safe!";
          resultDiv.style.color = "green";
        } else {
          resultDiv.innerHTML = "❌ Phishing detected!<br>" + 
            response.badLinks.join("<br>");
          resultDiv.style.color = "red";
        }
      });
    });
  });