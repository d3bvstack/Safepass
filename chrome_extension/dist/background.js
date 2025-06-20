"use strict";
// Background script for the Safepass extension
/**
 * Initialize the background service worker
 */
const initBackgroundWorker = () => {
    console.log('Background service worker initialized.');
    // Set up message listeners
    chrome.runtime.onMessage.addListener(handleMessage);
    // Set up initial storage if needed
    initializeStorage();
};
/**
 * Handle incoming messages from other parts of the extension
 * @param message The message object
 * @param sender Information about the sender
 * @param sendResponse Function to send a response
 * @returns True if response will be sent asynchronously
 */
const handleMessage = (message, sender, sendResponse) => {
    console.log('Message received:', message);
    // Example message handling
    if (message.type === 'savePassword') {
        // Implement secure password saving logic here
        sendResponse({ success: true });
    }
    else if (message.type === 'getSettings') {
        // Get settings from storage
        chrome.storage.sync.get(['settings'], (result) => {
            sendResponse({ settings: result.settings || {} });
        });
        return true; // Will respond asynchronously
    }
    return false;
};
/**
 * Initialize storage with default settings if not already set
 */
const initializeStorage = () => {
    chrome.storage.sync.get(['settings'], (result) => {
        if (!result.settings) {
            const defaultSettings = {
                passwordLength: 32,
                includeUppercase: true,
                includeLowercase: true,
                includeNumbers: true,
                includeSymbols: false,
                excludeAmbiguous: false,
                allowDuplicates: true,
                passphraseWordCount: 4,
                passphraseSeparator: '-',
                passphraseCapitalize: true,
                passphraseIncludeNumber: true,
                passphraseIncludeSymbol: false,
                theme: 'light'
            };
            chrome.storage.sync.set({ settings: defaultSettings }, () => {
                console.log('Default settings initialized');
            });
        }
    });
};
// Initialize the background worker
initBackgroundWorker();
//# sourceMappingURL=background.js.map