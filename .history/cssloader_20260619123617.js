
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => loadweb(tabId, changeInfo, tab));

async function loadweb(tabId, changeInfo, tab) {

    browser.tabs.insertCSS({
        file: "styles/default.css"
    });

    // if (changeInfo.url) {
    //     const hostname = new URL(tab.url).hostname;
    //     console.log(hostname)

    //     let data = await browser.storage.local.get("sites");

    //     let sites = data.sites || [];

    //     if (!sites.includes(hostname)) {
    //         sites.push(hostname);
    //         await browser.storage.local.set({ sites });
    //     }
    // } 
}