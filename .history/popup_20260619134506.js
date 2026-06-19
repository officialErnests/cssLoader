const textare = document.getElementById("css")
async function load_def() {
    const web = await browser.storage.local.get("curent_web");
    const key = "web_" + web.curent_web;
    const result = await browser.storage.local.get(key);
    textare.value = result.key;
}
document.getElementById("save").addEventListener("click", async () => {
    const web = await browser.storage.local.get("curent_web");
    const key = "web_" + web.curent_web;
    await browser.storage.local.set({[key]: textare.value});
});
document.getElementById("reload").addEventListener('click', async () => {
    browser.tabs.query({ active: true, currentWindow: true })
        .then(tabs => browser.tabs.reload(tabs[0].id));
})
document.getElementById("discard").addEventListener('click', load_def())
document.getElementById("unload").addEventListener('click', async () => {
    browser.tabs.query({})
      .then(tabs => {
        tabs.forEach(tab => {
          if (!tab.active) browser.tabs.discard(tab.id);
        });
      });
})