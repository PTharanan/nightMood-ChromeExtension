document.getElementById("toggleBtn").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {

      // If dark mode exists → remove and restore original
      const existing = document.getElementById("night-mood-style");
      if (existing) {
        existing.remove();
        return "OFF";   // tell popup to update button
      }

      // Otherwise → enable dark mode
      const style = document.createElement("style");
      style.id = "night-mood-style";
      style.textContent = `
        /* Content dark mode — navbar excluded */
        body *:not(nav):not(header):not(.navbar):not(.site-header):not(header *):not(nav *):not(.navbar *):not(.site-header *) {
          background-color: transparent !important;
          color: #ffffff !important;
        }

        body {
          background-color: #000000 !important;
        }

        img, video {
          filter: brightness(0.8) contrast(1.2);
        }
      `;
      document.documentElement.appendChild(style);

      return "ON";
    }
  }, (result) => {
    // Update button text ON <-> OFF
    const mode = result[0].result;
    document.getElementById("toggleBtn").textContent = mode === "ON" ? "OFF" : "ON";
  });
});
