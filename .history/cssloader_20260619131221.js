
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => loadweb(tabId, changeInfo, tab));

async function loadweb(tabId, changeInfo, tab) {
    const hostname = new URL(tab.url).hostname;

    await browser.storage.local.set({curent_web: hostname});
    const key = "web_" + hostname;
    const result = await browser.storage.local.get(key);
    if (result[key] === undefined)
    console.log(result);
    
}