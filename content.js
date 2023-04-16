(function () {
  if (window.contentScriptInjected) {
    monitor(); // Call the monitor function if the content script has already been injected
    return;
  }

  window.contentScriptInjected = true;

  function monitor() {
    if (typeof window.monitoring === "undefined") {
      window.monitoring = false;
    }

    const findButtonNext = () => {
      return document.getElementById("arrow-next");
    };

    if (!window.location.href.includes("/courseflow")) {
      // Not on a course page
      if (window.monitoring) {
        // We were monitoring. Stop monitoring.
        console.log("Monitoring stopped due to URL mismatch");
        clearInterval(window.interval);
      } else {
        console.log("Monitoring not started due to URL mismatch");
      }
      window.monitoring = false;
      chrome.runtime.sendMessage({ monitoring: false });
      return window.monitoring;
    }

    if (!window.monitoring) {
      // We were not monitoring. Start monitoring.
      window.monitoring = true;
      console.log("Monitoring started");
      chrome.runtime.sendMessage({ monitoring: true }); // Send message that monitoring is still active
      window.interval = setInterval(() => {
        const buttonNext = findButtonNext();
        chrome.runtime.sendMessage({ monitoring: true }); // Send message that monitoring is still active
        if (buttonNext) {
          if (!buttonNext.disabled) {
            buttonNext.click();
            console.log("Button clicked");
          } else {
            console.log("Button found, but disabled");
          }
        } else {
          console.log("Button not found");
        }
      }, 15000);
    } else {
      // We were monitoring. Stop monitoring.
      window.monitoring = false;
      clearInterval(window.interval);
      console.log("Monitoring stopped");
      chrome.runtime.sendMessage({ monitoring: false }); // Send message when monitoring stops
    }

    return window.monitoring;
  }

  monitor();
})();
