const textare = document.getElementById("css")
document.getElementById("save").addEventListener("click", async () => {
    const web = await browser.storage.local.get("curent_web");
    const key = "web_" + web.curent_web;
    const result = await browser.storage.local.set({[key]: textare.innerHtml});
});
document.getElementById("reload").addEventListener('click', async () => {
    browser.tabs.reload();
})