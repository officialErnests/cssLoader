
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => loadweb(tabId, changeInfo, tab));

async function loadweb(tabId, changeInfo, tab) {
    const hostname = new URL(tab.url).hostname;
    current_slot = await browser.storage.local.get('current_slot');
    if (current_slot['current_slot'] == null) {
        current_slot['current_slot'] = 0
        await browser.storage.local.set({ 'current_slot': 0 });
    }

    await browser.storage.local.set({ curent_web: hostname });
    const key = "web_" + current_slot['current_slot'] + "_" + hostname;
    
    let result = await browser.storage.local.get(key);
    if (result[key] === undefined) {
        result = await browser.storage.local.set({ [key]: "/* Custom style */" });
    }

    await browser.scripting.insertCSS({
        target: { tabId: tab.id },
        css: result[key]
    });
}