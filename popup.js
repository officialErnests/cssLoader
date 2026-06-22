const textare = document.getElementById("css")
const curTab = document.getElementById("current")
const slot = document.getElementById("slot")
const tab_1_btn = document.getElementById("stylize")
const tab_2_btn = document.getElementById("slots")
const tab_3_btn = document.getElementById("utils")
const tab_1_element = document.getElementById("stylize_element")
const tab_2_element = document.getElementById("slots_element")
const tab_3_element = document.getElementById("utils_element")
let current_slot
let current_tab
function renderSlot() {
  slot.innerText = "Current slot: " + (current_slot['current_slot'])
}
async function load_def() {
  current_slot = await browser.storage.local.get('current_slot');
  if (current_slot['current_slot'] == null) {
    current_slot['current_slot'] = 0
    await browser.storage.local.set({ 'current_slot': 0 });
  }
  renderSlot()

  let hostname = "default"
  await browser.tabs.query({ active: true, currentWindow: true })
    .then(tabs => {
      const currentTab = tabs[0];
      hostname = new URL(currentTab.url).hostname
    });
  const key = "web_" + current_slot + "_" + hostname;
  const result = await browser.storage.local.get(key);
  textare.value = result[key];
  curTab.innerText = 'Curent tab:' + hostname;
}
document.getElementById("save").addEventListener("click", async () => {
  let hostname = "default"
  await browser.tabs.query({ active: true, currentWindow: true })
    .then(tabs => {
      const currentTab = tabs[0];
      hostname = new URL(currentTab.url).hostname
    });
  const key = "web_" + current_slot + "_" + hostname;
  await browser.storage.local.set({ [key]: textare.value });

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


async function firstLoad() {
  current_tab = await browser.storage.local.get('current_tab');
  if (current_tab["current_tab"] == null) {
    current_tab["current_tab"] = 1
    await browser.storage.local.set({ ['current_tab']: 1 })
  }
  if (current_tab['current_tab'] != 1) { tab_1_element.classList.add("hidden") }
  if (current_tab['current_tab'] != 2) { tab_2_element.classList.add("hidden") }
  if (current_tab['current_tab'] != 3) { tab_3_element.classList.add("hidden") }
}
tab_1_btn.addEventListener('click', async () => {
  await browser.storage.local.set({ ["current_tab"]: 1 })
  tab_1_element.classList.remove("hidden")
  tab_2_element.classList.add('hidden')
  tab_3_element.classList.add('hidden')
})
tab_2_btn.addEventListener('click', async () => {
  await browser.storage.local.set({ ["current_tab"]: 2 })
  tab_1_element.classList.add('hidden')
  tab_2_element.classList.remove("hidden")
  tab_3_element.classList.add('hidden')
})
tab_3_btn.addEventListener('click', async () => {
  await browser.storage.local.set({ ["current_tab"]: 3 })
  tab_1_element.classList.add('hidden')
  tab_2_element.classList.add('hidden')
  tab_3_element.classList.remove("hidden")
})

const slot_selector_element = document.getElementById('slot_selector')
document.getElementById('slot_create').addEventListener('click', async () => {
  const x = document.getElementById('slot_name')
  slots_error.innerText = ""
  const regex = /^[\^A-Za-z< =>"!@#$%&*()_+{}:;'<>?,.\[\]\/\\`~0-9]{1,1000}$/;
  if (regex.test(x.value)) {
    let create_index = await browser.storage.local.get("create_index")
    if (create_index['create_index'] == null) {
      await browser.storage.local.set({ ['slot_0']: '<span style="text-shadow: 2px 2px #f0f; translation: skewX(10deg);">Default</span>' })
      innitDefault()
      create_index['create_index'] = 1
      browser.storage.local.set({ ['create_index']: 2 })
    }
    await browser.storage.local.set({ ['current_slot']: create_index['create_index'] })
    await browser.storage.local.set({ ['slot_' + create_index['create_index']]: x.value })
    current_slot = create_index
    browser.storage.local.set({ ['create_index']: create_index['create_index'] + 1 })
    refreshSlots()
  } else {
    slots_error.innerText = "Name must be 1-1000 chars long"
    setTimeout(() => {
      slots_error.innerText = ""
    }, 5000);
  }
})
async function refreshSlots() {

  let b = await browser.storage.local.get('current_slot')
  slot_selector_element.value = b['current_slot']
  const key = "slot_" + b['current_slot']
  let x = await browser.storage.local.get(key)
  document.getElementById('curent_slot').innerHTML = x[key]
  document.getElementById('slot_rename').value = x[key]
  renderSlot()
}
async function innitDefault() {

  console.log('INNIT THE MAIN');

}
slot_selector_element.addEventListener('change', async () => {
  slot_selector_element.value = Math.max(Math.min(slot_selector_element.value, 1000), 0)
  const key = "slot_" + slot_selector_element.value
  let x = await browser.storage.local.get(key)
  if (x[key] == null) {
    return
  }
  await browser.storage.local.set({ ['current_slot']: slot_selector_element.value})
  document.getElementById('curent_slot').innerHTML = x[key]
  document.getElementById('slot_rename').value = x[key]
  renderSlot()
})
document.getElementById('slot_rename_btn').addEventListener('click', async () => {
  let b = await browser.storage.local.get('current_slot')
  const key = "slot_" + b['current_slot']
  await browser.storage.local.set({[b[key]]: document.getElementById('slot_rename').value})
  renderSlot()
})

firstLoad()
load_def()
refreshSlots()