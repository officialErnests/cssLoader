console.log("HI");
function Guh() {
    console.log("SSS");
    
}
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    console.log("Navigated to:", changeInfo.url);

    const hostname = new URL(changeInfo.url).hostname;
    console.log("Website:", hostname);
  }
});