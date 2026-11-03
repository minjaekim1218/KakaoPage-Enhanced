const features = ['hideAds', 'injectRecent', 'highlightContinue', 'highlightTicket'];

// Load stored settings on popup open
chrome.storage.sync.get(features, (settings) => {
  features.forEach((key) => {
    const checkbox = document.getElementById(key);
    checkbox.checked = settings[key] !== undefined ? settings[key] : true;

    checkbox.addEventListener('change', () => {
      chrome.storage.sync.set({ [key]: checkbox.checked });
    });
  });
});