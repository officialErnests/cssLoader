document.getElementById("show").addEventListener("click", async () => {
  let data = await browser.storage.local.get("sites");

  document.getElementById("output").textContent =
    data.sites ? data.sites.join("\n") : "No sites saved";
});