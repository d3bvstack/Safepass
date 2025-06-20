// Content script
console.log('Content script loaded.');

// Listen for autofill messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type === 'Safepass_AUTOFILL' && message.value) {
    // Try to find the first visible password field
    const passwordFields = Array.from(document.querySelectorAll('input[type="password"]'));
    const visibleField = passwordFields.find(f => f.offsetParent !== null && !f.disabled && !f.readOnly);
    if (visibleField) {
      visibleField.focus();
      visibleField.value = message.value;
      // Dispatch input/change events for frameworks
      visibleField.dispatchEvent(new Event('input', { bubbles: true }));
      visibleField.dispatchEvent(new Event('change', { bubbles: true }));
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: 'No visible password field found.' });
    }
    return true; // Keep the message channel open for async response
  }
});
// Copyright (c) 2025 d3bvstack. All rights reserved.
// Attribution: d3bvstack, 2025.
