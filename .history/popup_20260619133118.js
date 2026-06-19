document.getElementById("save").addEventListener("click", async () => {
    const web = await browser.storage.local.get("curent_web");
    const key = "web_" + web.curent_web;
    const result = await browser.storage.local.get(key);
    console.log(result[key]);
    
    if (result[key] === undefined) {
        const result = await browser.storage.local.set({[key]: "/* Custom style */"});
    }
});