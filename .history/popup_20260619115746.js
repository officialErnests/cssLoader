async function updatePopup() {
  try {
    const [tab] = await browser.tabs.query({ 
      active: true, 
      currentWindow: true 
    });
    
    if (!tab || !tab.url) {
      document.getElementById('site-name').textContent = 'No active tab';
      document.getElementById('site-url').textContent = 'N/A';
      return;
    }
    
    const response = await browser.runtime.sendMessage({ 
      action: 'getCurrentSite' 
    });
    
    if (response) {
      document.getElementById('site-name').textContent = response.site;
      document.getElementById('site-url').textContent = response.url;
      document.getElementById('css-filename').textContent = `styles/${response.site}.css`;
      
      // Update file status
      const statusEl = document.getElementById('file-status');
      const badge = document.getElementById('file-badge');
      
      if (response.hasFile) {
        statusEl.textContent = '✓ Loaded';
        statusEl.className = 'status';
        badge.textContent = 'CUSTOM';
        badge.style.background = '#28a745';
      } else {
        statusEl.textContent = '⚠ Using default';
        statusEl.className = 'status missing';
        badge.textContent = 'DEFAULT';
        badge.style.background = '#ffc107';
      }
      
      // Show CSS preview
      const preview = document.getElementById('css-preview');
      if (response.css && response.css.trim()) {
        preview.textContent = response.css.trim();
        preview.className = 'css-preview';
      } else {
        preview.innerHTML = '<span class="empty">No CSS content loaded</span>';
      }
    }
    
  } catch (error) {
    console.error('Error updating popup:', error);
    document.getElementById('site-name').textContent = 'Error';
    document.getElementById('site-url').textContent = error.message;
  }
}

// Reload button
document.getElementById('reload-btn').addEventListener('click', async () => {
  const btn = document.getElementById('reload-btn');
  const status = document.getElementById('status');
  
  btn.disabled = true;
  status.textContent = '🔄 Reloading...';
  
  try {
    await browser.runtime.sendMessage({ action: 'reloadCSS' });
    status.textContent = '✅ CSS reloaded successfully!';
    setTimeout(() => updatePopup(), 300);
  } catch (error) {
    status.textContent = '❌ Error: ' + error.message;
  } finally {
    btn.disabled = false;
    setTimeout(() => {
      status.textContent = 'Ready';
    }, 3000);
  }
});

// Open folder button - shows instructions
document.getElementById('open-folder-btn').addEventListener('click', async () => {
  const status = document.getElementById('status');
  status.textContent = '📁 Create CSS files in the "styles" folder of your extension';
  status.style.color = '#0060df';
  
  // Show extension folder location
  try {
    const extensionURL = browser.runtime.getURL('');
    status.textContent += `\n📍 ${extensionURL}styles/`;
  } catch (e) {
    // Ignore
  }
  
  setTimeout(() => {
    status.style.color = '#28a745';
  }, 5000);
});

// Update when popup opens
document.addEventListener('DOMContentLoaded', updatePopup);

// Auto-refresh every 5 seconds
setInterval(updatePopup, 5000);