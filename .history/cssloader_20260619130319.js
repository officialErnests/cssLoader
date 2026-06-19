
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

    const hostname = new URL(tab.url).hostname;

    await browser.storage.local.set({curent_web: hostname});
    console.log(hostname);
    
    // const result = await browser.storage.local.get(hostname);
    // console.log(result.default);
    // await browser.scripting.insertCSS({
    //     target: { tabId: tab.id },
    //     css: result.default
    // });
    
    // console.log("after")

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