const textare = document.getElementById("css")
const curTab = document.getElementById("current")
async function load_def() {
    let hostname = "default"
    await browser.tabs.query({ active: true, currentWindow: true })
    .then(tabs => {
      const currentTab = tabs[0];
      hostname = new URL(currentTab.url).hostname
    });
    const key = "web_" + hostname;
    const result = await browser.storage.local.get(key);
    textare.value = result[key];
    curTab.innerText = hostname;
}
load_def()
document.getElementById("save").addEventListener("click", async () => {
    let hostname = "default"
    await browser.tabs.query({ active: true, currentWindow: true })
    .then(tabs => {
      const currentTab = tabs[0];
      hostname = new URL(currentTab.url).hostname
    });
    const key = "web_" + hostname;
    await browser.storage.local.set({[key]: textare.value});
    
    await browser.tabs.query({ active: true, currentWindow: true })
    .then(tabs => async (tabs) => {
      const currentTab = tabs[0];
      await browser.scripting.insertCSS({
        target: { tabId: currentTab.id },
        css: textare.value
      });
    });
    
});
document.getElementById("reload").addEventListener('click', async () => {
    browser.tabs.query({ active: true, currentWindow: true })
        .then(tabs => browser.tabs.reload(tabs[0].id));
})
document.getElementById("discard").addEventListener('click', load_def)
document.getElementById("unload").addEventListener('click', async () => {
    browser.tabs.query({})
      .then(tabs => {
        tabs.forEach(tab => {
          if (!tab.active) browser.tabs.discard(tab.id);
        });
      });
})