// Store CSS rules for different sites
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

// Function to get site key from URL
function getSiteKey(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // Remove www. if present
    const cleanHost = hostname.replace(/^www\./, '');
    
    // Check if any site key matches
    for (const [key, css] of Object.entries(siteStyles)) {
      if (cleanHost.includes(key)) {
        return key;
      }
    }
    return 'default';
  } catch (error) {
    return 'default';
  }
}

// Inject CSS when tab is updated or activated
async function injectCSSForTab(tabId, url) {
  if (!url || url.startsWith('about:') || url.startsWith('moz-extension:')) {
    return;
  }
  
  const siteKey = getSiteKey(url);
  const css = siteStyles[siteKey] || siteStyles['default'];
  
  try {
    // Remove previous injection if any
    await browser.tabs.sendMessage(tabId, { 
      action: 'removeCSS' 
    }).catch(() => {
      // Content script might not be loaded yet, ignore
    });
    
    // Inject new CSS
    await browser.tabs.insertCSS(tabId, {
      code: css,
      cssOrigin: 'author'
    });
    
    console.log(`Injected CSS for ${siteKey} on ${url}`);
    
    // Store current site info
    await browser.storage.local.set({
      currentSite: siteKey,
      currentUrl: url
    });
    
  } catch (error) {
    console.error('Failed to inject CSS:', error);
  }
}

// Listen for tab updates (navigation, page load)
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    injectCSSForTab(tabId, tab.url);
  }
});

// Listen for tab activation (switching tabs)
browser.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await browser.tabs.get(activeInfo.tabId);
  if (tab.url) {
    injectCSSForTab(tab.id, tab.url);
  }
});

// Listen for messages from popup
browser.runtime.onMessage.addListener(async (message, sender) => {
  if (message.action === 'getCurrentSite') {
    const [tab] = await browser.tabs.query({ 
      active: true, 
      currentWindow: true 
    });
    return { 
      url: tab.url, 
      site: getSiteKey(tab.url) 
    };
  }
  
  if (message.action === 'reloadCSS') {
    const [tab] = await browser.tabs.query({ 
      active: true, 
      currentWindow: true 
    });
    await injectCSSForTab(tab.id, tab.url);
  }
});

// Initial injection for already open tabs
browser.tabs.query({ active: true, currentWindow: true })
  .then(tabs => {
    if (tabs[0] && tabs[0].url) {
      injectCSSForTab(tabs[0].id, tabs[0].url);
    }
  });