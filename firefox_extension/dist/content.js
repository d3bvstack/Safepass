"use strict";
// Content script for the Safepass extension
/**
 * Initialize the content script
 */
const initContentScript = () => {
    console.log('Content script initialized');
    // Listen for messages from the extension
    chrome.runtime.onMessage.addListener(handleExtensionMessage);
    // Add event listener for password fields if needed
    observePasswordFields();
};
/**
 * Handle messages from the extension
 * @param message The message object
 * @param sender Information about the sender
 * @param sendResponse Function to send a response
 */
const handleExtensionMessage = (message, sender, sendResponse) => {
    console.log('Message received:', message.type);
    if (message.type === 'fillPassword') {
        fillPasswordField(message.password);
        sendResponse({ success: true });
    }
};
/**
 * Fill a password into the active password field
 * @param password The password to fill
 */
const fillPasswordField = (password) => {
    // Get the active element if it's a password field
    const activeElement = document.activeElement;
    if (activeElement &&
        (activeElement.type === 'password' ||
            activeElement.getAttribute('autocomplete') === 'new-password')) {
        // Fill in the password
        activeElement.value = password;
        // Dispatch input event to trigger validation
        const inputEvent = new Event('input', { bubbles: true });
        activeElement.dispatchEvent(inputEvent);
        // Dispatch change event
        const changeEvent = new Event('change', { bubbles: true });
        activeElement.dispatchEvent(changeEvent);
    }
};
/**
 * Observe for password fields being added to the DOM
 */
const observePasswordFields = () => {
    // Set up a mutation observer to detect new password fields
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node;
                        const passwordFields = element.querySelectorAll('input[type="password"]');
                        passwordFields.forEach((field) => {
                            // Add event listeners or other logic for password fields
                            console.log('Password field detected');
                        });
                    }
                });
            }
        });
    });
    // Start observing the document with configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
};
// Initialize content script
initContentScript();
//# sourceMappingURL=content.js.map