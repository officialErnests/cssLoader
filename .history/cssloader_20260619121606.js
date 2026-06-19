document.body.style.border = "5px solid red";
console.log("HI");
function Guh() {
    console.log("SSS");
}
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("AAA")
  if (changeInfo.url) {
    const hostname = new URL(tab.url).hostname;

    let data = await browser.storage.local.get("sites");

    let sites = data.sites || [];

    if (!sites.includes(hostname)) {
        sites.push(hostname);
        await browser.storage.local.set({ sites });
    }
  }
});