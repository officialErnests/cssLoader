// Listen for cleanup messages
browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'removeCSS') {
    // Remove any dynamically added styles
    const styles = document.querySelectorAll('style[data-injected="true"]');
    styles.forEach(style => style.remove());
    
    // Alternative: Remove all style elements that were added by extension
    const extensionStyles = document.querySelectorAll('style');
    extensionStyles.forEach(style => {
      if (style.textContent.includes('!important')) {
        style.remove();
      }
    });
  }
});

// Log when content script is loaded
console.log('📄 Content script loaded for:', window.location.href);