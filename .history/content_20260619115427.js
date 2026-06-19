// Listen for cleanup messages
browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'removeCSS') {
    // Remove any dynamically added styles
    const styles = document.querySelectorAll('style[data-injected="true"]');
    styles.forEach(style => style.remove());
  }
});