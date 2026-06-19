// Cache for loaded CSS
const cssCache = new Map();

// Get site key from URL
function getSiteKey(url) {
  try {
    const urlObj = new URL(url);
    let hostname = urlObj.hostname.replace(/^www\./, '');
    
    // Remove subdomains for better matching
    const parts = hostname.split('.');
    if (parts.length > 2) {
      // Try to match domain.tld
      return parts.slice(-2).join('.');
    }
    return hostname;
  } catch (error) {
    return 'default';
  }
}

// Load CSS file from styles folder
async function loadCSSFile(siteKey) {
  // Check cache first
  if (cssCache.has(siteKey)) {
    return cssCache.get(siteKey);
  }
  
  try {
    const cssFile = `styles/${siteKey}.css`;
    const url = browser.runtime.getURL(cssFile);
    const response = await fetch(url);
    
    if (!response.ok) {
      // If specific file doesn't exist, try default
      if (siteKey !== 'default') {
        return await loadCSSFile('default');
      }
      return '';
    }
    
    const css = await response.text();
    cssCache.set(siteKey, css);
    return css;
  } catch (error) {
    // Try default if specific file fails
    if (siteKey !== 'default') {
      return await loadCSSFile('default');
    }
    console.warn(`No CSS found for ${siteKey}`);
    return '';
  }
}

// Inject CSS for a tab
async function injectCSSForTab(tabId, url) {
  if (!url || url.startsWith('about:') || url.startsWith('moz-extension:')) {
    return;
  }
  
  const siteKey = getSiteKey(url);
  
  try {
    // Remove previous injection
    await browser.tabs.sendMessage(tabId, { 
      action: 'removeCSS' 
    }).catch(() => {
      // Content script might not be loaded yet
    });
    
    // Load and inject CSS
    const css = await loadCSSFile(siteKey);
    
    if (css && css.trim()) {
      await browser.tabs.insertCSS(tabId, {
        code: css,
        cssOrigin: 'author'
      });
      
      console.log(`✅ Injected CSS for ${siteKey} on ${url}`);
      
      // Store current site info
      await browser.storage.local.set({
        currentSite: siteKey,
        currentUrl: url,
        cssLength: css.length
      });
    } else {
      console.log(`ℹ️ No CSS for ${siteKey}`);
    }
    
  } catch (error) {
    console.error(`❌ Failed to inject CSS for ${siteKey}:`, error);
  }
}

// Load all CSS files on startup (preload)
async function preloadCSSFiles() {
  try {
    // Get list of all CSS files (this would require a manifest)
    // Alternatively, try to load common ones
    const commonSites = ['youtube.com', 'github.com', 'reddit.com', 'google.com', 'default'];
    
    for (const site of commonSites) {
      await loadCSSFile(site);
    }
    console.log('📦 Preloaded CSS files:', cssCache.size);
  } catch (error) {
    console.error('Error preloading CSS:', error);
  }
}

// Listen for tab updates
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    injectCSSForTab(tabId, tab.url);
  }
});

// Listen for tab activation
browser.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await browser.tabs.get(activeInfo.tabId);
  if (tab.url) {
    injectCSSForTab(tab.id, tab.url);
  }
});

// Listen for navigation
browser.webNavigation.onCompleted.addListener((details) => {
  if (details.frameId === 0) { // Main frame only
    injectCSSForTab(details.tabId, details.url);
  }
});

// Handle messages from popup
browser.runtime.onMessage.addListener(async (message, sender) => {
  if (message.action === 'getCurrentSite') {
    const [tab] = await browser.tabs.query({ 
      active: true, 
      currentWindow: true 
    });
    const siteKey = getSiteKey(tab.url);
    const css = await loadCSSFile(siteKey);
    
    return { 
      url: tab.url, 
      site: siteKey,
      css: css,
      hasFile: cssCache.has(siteKey)
    };
  }
  
  if (message.action === 'reloadCSS') {
    const [tab] = await browser.tabs.query({ 
      active: true, 
      currentWindow: true 
    });
    const siteKey = getSiteKey(tab.url);
    cssCache.delete(siteKey); // Clear cache to force reload
    await injectCSSForTab(tab.id, tab.url);
    return { success: true };
  }
  
  if (message.action === 'listCSSFiles') {
    // Return list of loaded CSS files
    return { files: Array.from(cssCache.keys()) };
  }
});

// Initialize
preloadCSSFiles();

// Inject for current tab on startup
browser.tabs.query({ active: true, currentWindow: true })
  .then(tabs => {
    if (tabs[0] && tabs[0].url) {
      injectCSSForTab(tabs[0].id, tabs[0].url);
    }
  });