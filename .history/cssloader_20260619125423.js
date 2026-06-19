
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => loadweb(tabId, changeInfo, tab));

async function loadweb(tabId, changeInfo, tab) {


    // fetch(cssURL)
    // .then(res => res.text())
    // .then(css => {
    //     console.log("CSS loaded:", css);
    // })
    // .catch(err => {
    //     console.error("CSS load failed:", err);
    // });
    await browser.storage.local.set("*{color:hotpink;}")
    await browser.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ["styles/default.css"]
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