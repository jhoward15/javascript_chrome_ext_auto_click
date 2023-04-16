chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id, allFrames: true },
      files: ["content.js"],
    },
    (result) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        return;
      }

      const monitoring = result[0].result;
      const badgeText = monitoring ? "ON" : "";
      const badgeColor = monitoring ? "blue" : [0, 0, 0, 0]; // Transparent color when monitoring is off
      chrome.action.setBadgeText({ text: badgeText });
      chrome.action.setBadgeBackgroundColor({ color: badgeColor });
    }
  );
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (typeof request.monitoring !== "undefined") {
    const badgeText = request.monitoring ? "ON" : "";
    const badgeColor = request.monitoring ? "blue" : [0, 0, 0, 0]; // Transparent color when monitoring is off
    chrome.action.setBadgeText({ text: badgeText });
    chrome.action.setBadgeBackgroundColor({ color: badgeColor });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && !changeInfo.url.includes("/courseflow")) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId, allFrames: true },
        function: () => {
          if (window.monitoring) {
            window.monitoring = false;
            clearInterval(window.interval);
            console.log("Monitoring stopped due to URL mismatch");
            chrome.runtime.sendMessage({ monitoring: false });
          }
        },
      },
      (result) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          return;
        }
      }
    );
  }
});
