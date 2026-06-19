// Site styles (same as background)
const siteStyles = {
  'youtube.com': `
    body {
      background-color: #1a1a1a !important;
    }
    .ytd-video-renderer {
      border-radius: 12px !important;
    }
  `,
  'github.com': `
    .repository-content {
      max-width: 1400px !important;
      margin: 0 auto !important;
    }
  `,
  'reddit.com': `
    ._1oQyIsiPHYt6nx7VOmd1sz {
      background: #f0f0f0 !important;
    }
  `,
  'google.com': `
    input[type="text"] {
      border-radius: 24px !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
    }
  `,
  'default': `
    /* Default styles for any site */
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
    }
  `
};

function getSiteKey(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace(/^www\./, '');
    
    for (const [key, css] of Object.entries(siteStyles)) {
      if (hostname.includes(key)) {
        return key;
      }
    }
    return 'default';
  } catch (error) {
    return 'default';
  }
}

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
    
    const siteKey = getSiteKey(tab.url);
    const css = siteStyles[siteKey] || siteStyles['default'];
    
    document.getElementById('site-name').textContent = siteKey;
    document.getElementById('site-url').textContent = tab.url;
    document.getElementById('css-preview').textContent = css.trim() || 'No CSS applied';
    
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
  status.textContent = 'Reloading...';
  
  try {
    await browser.runtime.sendMessage({ action: 'reloadCSS' });
    status.textContent = '✅ CSS reloaded successfully!';
    setTimeout(() => updatePopup(), 500);
  } catch (error) {
    status.textContent = '❌ Error: ' + error.message;
  } finally {
    btn.disabled = false;
    setTimeout(() => {
      status.textContent = 'Ready';
    }, 3000);
  }
});

// Update popup when opened
document.addEventListener('DOMContentLoaded', updatePopup);