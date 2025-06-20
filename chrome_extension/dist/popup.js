"use strict";
// Popup script for the Safepass extension
/**
 * Initializes the popup functionality
 */
document.addEventListener("DOMContentLoaded", () => {
    console.log("Popup script loaded.");
    // Initialize segment control content visibility
    initSegmentContentVisibility();
    // Initialize advanced options sync
    initAdvancedOptionsSync();
    // Initialize character sliders
    initCharacterSliders();
    // Initialize password generator
    initPasswordGenerator();
    // Consolidated event listener setup
    setupEventListeners();
});
/**
 * Function to handle segment content visibility
 */
function initSegmentContentVisibility() {
    const segmentControl = document.querySelector("segment-control");
    const segmentContents = document.querySelectorAll(".segment-content");
    if (!segmentControl)
        return;
    // Hide all content sections initially
    segmentContents.forEach((content) => {
        content.hidden = true;
    });
    // Show the initially selected content
    const initialSelected = segmentControl.getAttribute("selected") || "option1";
    const initialContent = document.getElementById(`${initialSelected}-content`);
    if (initialContent) {
        initialContent.hidden = false;
    }
}
/**
 * Function to synchronize advanced options state between tabs
 */
function initAdvancedOptionsSync() {
    // Get advanced options elements from both tabs
    const passwordAdvancedOptions = document.querySelector("#option1-content advanced-options");
    const passphraseAdvancedOptions = document.querySelector("#option2-content advanced-options");
    const segmentControl = document.querySelector("segment-control");
    if (!passwordAdvancedOptions || !passphraseAdvancedOptions || !segmentControl)
        return;
    // Track dropdown state
    let isAdvancedOptionsOpen = false;
    // When switching between tabs, ensure advanced options state is synced
    segmentControl.addEventListener("segment-updated", () => {
        // Sync advanced options state based on tracked state
        if (isAdvancedOptionsOpen) {
            // @ts-ignore - Custom element methods
            passwordAdvancedOptions.open();
            // @ts-ignore - Custom element methods
            passphraseAdvancedOptions.open();
        }
        else {
            // @ts-ignore - Custom element methods
            passwordAdvancedOptions.close();
            // @ts-ignore - Custom element methods
            passphraseAdvancedOptions.close();
        }
    });
}
/**
 * Function to initialize character sliders
 */
function initCharacterSliders() {
    const passwordLengthSlider = document.getElementById("length-slider");
    const passwordLengthCheckbox = document.getElementById("custom-length");
    const lengthSliderContainer = document.getElementById("length-slider-container");
    const wordsCountSlider = document.getElementById("words-slider");
    const wordsCountCheckbox = document.getElementById("custom-words");
    const wordsSliderContainer = document.getElementById("words-slider-container");
    if (!passwordLengthCheckbox || !lengthSliderContainer ||
        !wordsCountCheckbox || !wordsSliderContainer)
        return;
    // Set initial states
    lengthSliderContainer.hidden = !passwordLengthCheckbox.checked;
    wordsSliderContainer.hidden = !wordsCountCheckbox.checked;
}
/**
 * Function to initialize password generator functionality
 */
function initPasswordGenerator() {
    // Import password generator service
    import('./services/password_generator.js')
        .then(module => {
        // @ts-ignore - Define global property for convenience
        window.passwordGenerator = module.default;
        // Generate initial password and passphrase
        generatePassword();
        generatePassphrase();
    })
        .catch(error => {
        console.error("Error loading password generator:", error);
    });
}
/**
 * Function to generate password based on current options
 */
function generatePassword() {
    // @ts-ignore - Global property access
    if (!window.passwordGenerator)
        return;
    const passwordContainer = document.querySelector("#option1-content password-container");
    const lengthSlider = document.getElementById("length-slider");
    const customLengthCheckbox = document.getElementById("custom-length");
    if (!passwordContainer || !lengthSlider || !customLengthCheckbox)
        return;
    // Get checkbox states
    const includeLowercase = document.getElementById("lowercase").checked;
    const includeUppercase = document.getElementById("uppercase").checked;
    const includeNumbers = document.getElementById("numbers").checked;
    const includeSpecial = document.getElementById("symbols").checked;
    const excludeSimilar = document.getElementById("exclude-ambiguous").checked;
    const allowDuplicates = document.getElementById("allo-duplicates").checked;
    // Determine password length
    const length = customLengthCheckbox.checked ? parseInt(lengthSlider.value) : 32;
    // Generate password with options
    // @ts-ignore - Custom element methods
    const password = window.passwordGenerator.generatePassword({
        length,
        includeLowercase,
        includeUppercase,
        includeNumbers,
        includeSpecial,
        requireAll: true,
        excludeSimilar,
        excludeAmbiguous: excludeSimilar,
        allowDuplicates
    });
    // Update password container with new password
    // @ts-ignore - Custom element methods
    passwordContainer.setValue(password);
    // Update strength badge
    updatePasswordStrength(password);
}
/**
 * Function to generate passphrase based on current options
 */
async function generatePassphrase() {
    // @ts-ignore - Global property access
    if (!window.passwordGenerator)
        return;
    const passphraseContainer = document.querySelector("#option2-content password-container");
    const wordsSlider = document.getElementById("words-slider");
    const customWordsCheckbox = document.getElementById("custom-words");
    if (!passphraseContainer || !wordsSlider || !customWordsCheckbox)
        return;
    // Get checkbox states
    const capitalize = document.getElementById("capitalize").checked;
    const useCommonWords = document.getElementById("common-words").checked;
    const includeNumber = document.getElementById("include-number").checked;
    const includeSymbol = document.getElementById("include-symbol").checked;
    const customSeparator = document.getElementById("custom-separator").checked;
    const separatorInput = document.getElementById("separator-input");
    // Determine word count
    const wordCount = customWordsCheckbox.checked ? parseInt(wordsSlider.value) : 4;
    // Choose separator based on option
    let separator = "-";
    if (customSeparator && separatorInput && separatorInput.value) {
        separator = separatorInput.value;
    }
    else if (customSeparator) {
        separator = "_";
    }
    try {
        // Generate passphrase with options (await the Promise)
        // @ts-ignore - Custom element methods
        const passphrase = await window.passwordGenerator.generatePassphrase({
            wordCount,
            separator,
            capitalize,
            useCommonWords,
            includeNumbers: includeNumber,
            includeSpecial: includeSymbol
        });
        // Update passphrase container with new passphrase
        // @ts-ignore - Custom element methods
        passphraseContainer.setValue(passphrase);
        // Update strength badge
        updatePasswordStrength(passphrase);
    }
    catch (error) {
        console.error("Error generating passphrase:", error);
    }
}
/**
 * Function to update password strength indicator
 * @param text Password or passphrase to evaluate
 */
function updatePasswordStrength(text) {
    const strengthBadges = document.querySelectorAll("strength-badge");
    if (!text) {
        strengthBadges.forEach(badge => badge.setAttribute("strength", "none"));
        return;
    }
    // Import and use password strength calculator
    import('./services/password_strength.js')
        .then(module => {
        const strengthCalculator = module.default;
        const result = strengthCalculator.evaluate(text);
        // Determine strength based on time to crack and character variety
        let strength = "weak";
        const seconds = result.timeToCrack.seconds;
        const variety = result.characterVariety;
        const types = [variety.hasLowercase, variety.hasUppercase,
            variety.hasNumbers, variety.hasSymbols].filter(Boolean).length;
        if (seconds >= 31536000 && types >= 3 && result.length >= 12) {
            strength = "strong";
        }
        else if (seconds >= 3600 && types >= 2 && result.length >= 8) {
            strength = "medium";
        }
        // Build feedback string
        let feedback = `Time to crack: ${result.timeToCrack.text}.`;
        const typeList = [];
        if (variety.hasLowercase)
            typeList.push("lowercase");
        if (variety.hasUppercase)
            typeList.push("uppercase");
        if (variety.hasNumbers)
            typeList.push("numbers");
        if (variety.hasSymbols)
            typeList.push("symbols");
        feedback += ` Character types: ${typeList.join(", ") || "none"}.`;
        // Suggest improvements
        const suggestions = [];
        if (result.length < 12)
            suggestions.push("Use at least 12 characters for better security.");
        if (types < 3)
            suggestions.push("Add more character types (uppercase, numbers, symbols).");
        if (!variety.hasUppercase)
            suggestions.push("Add uppercase letters.");
        if (!variety.hasNumbers)
            suggestions.push("Add numbers.");
        if (!variety.hasSymbols)
            suggestions.push("Add symbols.");
        if (seconds < 3600)
            suggestions.push("Increase length and variety to slow down cracking.");
        if (suggestions.length > 0) {
            feedback += `\nSuggestions: ` + suggestions.join(" ");
        }
        if (result.length < 8)
            feedback += " Password is very short.";
        if (seconds < 1)
            feedback += " This password can be cracked instantly!";
        // Update badges
        strengthBadges.forEach(badge => {
            badge.setAttribute("strength", strength);
            badge.setAttribute("data-feedback", feedback);
        });
    })
        .catch(error => {
        console.error("Error loading password strength calculator:", error);
        // Fallback to basic strength calculation if there's an error
        let strength = "weak";
        if (text.length < 8) {
            strength = "weak";
        }
        else if (text.length >= 8 && text.length < 16) {
            strength = "medium";
        }
        else if (text.length >= 16) {
            strength = "strong";
        }
        const feedback = `Length: ${text.length}.`;
        strengthBadges.forEach(badge => {
            badge.setAttribute("strength", strength);
            badge.setAttribute("data-feedback", feedback);
        });
    });
}
/**
 * Consolidated event listener setup
 */
function setupEventListeners() {
    // Segment control event
    const segmentControl = document.querySelector("segment-control");
    if (segmentControl) {
        segmentControl.addEventListener("segment-updated", (event) => {
            // Hide all content sections
            const segmentContents = document.querySelectorAll(".segment-content");
            segmentContents.forEach((content) => {
                content.hidden = true;
            });
            // Show the selected content section
            // @ts-ignore - Custom event detail
            const selectedOption = event.detail.selected;
            const targetContent = document.getElementById(`${selectedOption}-content`);
            if (targetContent) {
                targetContent.hidden = false;
            }
        });
    }
    // Advanced options sync events
    const passwordAdvancedOptions = document.querySelector("#option1-content advanced-options");
    const passphraseAdvancedOptions = document.querySelector("#option2-content advanced-options");
    if (passwordAdvancedOptions && passphraseAdvancedOptions && segmentControl) {
        let isAdvancedOptionsOpen = false;
        passwordAdvancedOptions.addEventListener("toggle", (event) => {
            // @ts-ignore - Custom event detail
            isAdvancedOptionsOpen = event.detail.isOpen;
            if (segmentControl.getAttribute("selected") !== "option2") {
                if (isAdvancedOptionsOpen) {
                    // @ts-ignore - Custom element methods
                    passphraseAdvancedOptions.open();
                }
                else {
                    // @ts-ignore - Custom element methods
                    passphraseAdvancedOptions.close();
                }
            }
        });
        passphraseAdvancedOptions.addEventListener("toggle", (event) => {
            // @ts-ignore - Custom event detail
            isAdvancedOptionsOpen = event.detail.isOpen;
            if (segmentControl.getAttribute("selected") !== "option1") {
                if (isAdvancedOptionsOpen) {
                    // @ts-ignore - Custom element methods
                    passwordAdvancedOptions.open();
                }
                else {
                    // @ts-ignore - Custom element methods
                    passwordAdvancedOptions.close();
                }
            }
        });
        segmentControl.addEventListener("segment-updated", () => {
            if (isAdvancedOptionsOpen) {
                // @ts-ignore - Custom element methods
                passwordAdvancedOptions.open();
                // @ts-ignore - Custom element methods
                passphraseAdvancedOptions.open();
            }
            else {
                // @ts-ignore - Custom element methods
                passwordAdvancedOptions.close();
                // @ts-ignore - Custom element methods
                passphraseAdvancedOptions.close();
            }
        });
    }
    // Character sliders events
    const passwordLengthSlider = document.getElementById("length-slider");
    const passwordLengthCheckbox = document.getElementById("custom-length");
    const lengthSliderContainer = document.getElementById("length-slider-container");
    const wordsCountSlider = document.getElementById("words-slider");
    const wordsCountCheckbox = document.getElementById("custom-words");
    const wordsSliderContainer = document.getElementById("words-slider-container");
    if (passwordLengthCheckbox && lengthSliderContainer) {
        passwordLengthCheckbox.addEventListener("change", (event) => {
            // @ts-ignore - Custom event detail
            lengthSliderContainer.hidden = !event.detail.checked;
            generatePassword();
        });
    }
    if (wordsCountCheckbox && wordsSliderContainer) {
        wordsCountCheckbox.addEventListener("change", (event) => {
            // @ts-ignore - Custom event detail
            wordsSliderContainer.hidden = !event.detail.checked;
            generatePassphrase();
        });
    }
    if (passwordLengthSlider) {
        passwordLengthSlider.addEventListener("value-changed", () => {
            generatePassword();
        });
    }
    if (wordsCountSlider) {
        wordsCountSlider.addEventListener("value-changed", () => {
            generatePassphrase();
        });
    }
    // Password and passphrase options checkboxes
    const passwordCheckboxes = [
        document.getElementById("uppercase"),
        document.getElementById("lowercase"),
        document.getElementById("numbers"),
        document.getElementById("symbols"),
        document.getElementById("exclude-ambiguous"),
        document.getElementById("allo-duplicates")
    ];
    passwordCheckboxes.forEach(checkbox => {
        if (checkbox) {
            checkbox.addEventListener("change", () => {
                generatePassword();
            });
        }
    });
    const passphraseCheckboxes = [
        document.getElementById("capitalize"),
        document.getElementById("common-words"),
        document.getElementById("include-number"),
        document.getElementById("include-symbol"),
        document.getElementById("custom-separator")
    ];
    passphraseCheckboxes.forEach(checkbox => {
        if (checkbox) {
            checkbox.addEventListener("change", () => {
                generatePassphrase();
            });
        }
    });
    // Show/hide separator input based on custom separator checkbox
    const customSeparatorCheckbox = document.getElementById("custom-separator");
    const separatorInput = document.getElementById("separator-input");
    if (customSeparatorCheckbox && separatorInput) {
        customSeparatorCheckbox.addEventListener("change", () => {
            separatorInput.style.display = customSeparatorCheckbox.checked ? "inline-block" : "none";
            generatePassphrase();
        });
        separatorInput.addEventListener("input", () => {
            if (customSeparatorCheckbox.checked) {
                generatePassphrase();
            }
        });
    }
    // Regenerate buttons
    const passwordContainer = document.querySelector("#option1-content password-container");
    const passphraseContainer = document.querySelector("#option2-content password-container");
    if (passwordContainer) {
        passwordContainer.addEventListener("regenerate-clicked", () => {
            generatePassword();
        });
    }
    if (passphraseContainer) {
        passphraseContainer.addEventListener("regenerate-clicked", () => {
            generatePassphrase();
        });
    }
}
//# sourceMappingURL=popup.js.map