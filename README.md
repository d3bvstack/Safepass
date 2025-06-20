[![Safepass](https://github.com/user-attachments/assets/065b62d0-397b-499d-bc0a-de9896ed8b69)](https://github.com/d3bvstack/Safepass)

# Safepass

Safepass is a secure, open-source password generator browser extension available for Chrome and Firefox. It helps you create strong, customizable passwords with ease.

## Features

- Generate strong, random passwords
- Customizable password length and character sets
- User-friendly interface
- Password strength indicator
- Supports both Chrome and Firefox browsers

## Installation

### Chrome

1. Download the latest `chrome_extension.zip` from the [Releases](https://github.com/d3bvstack/Safepass/releases) page.
2. Open [chrome://extensions](chrome://extensions) in your browser.
3. Enable "Developer mode" (top right corner).
4. Drag and drop the `chrome_extension.zip` file onto the Chrome Extensions page to install.

### Firefox

1. Download the latest `firefox_extension.zip` from the [Releases](https://github.com/d3bvstack/Safepass/releases) page.
2. Open [about:addons](about:addons) or [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox) in your browser.
3. Drag and drop the `firefox_extension.zip` file onto the Add-ons or Debugging page to install.


#### Enabling Unsigned Add-ons in Firefox

By default, Firefox only allows unsigned extensions to be loaded temporarily for development. If you want to enable unsigned add-ons for longer-term use (not just temporary), you need to use Firefox Developer Edition or Nightly, or start Firefox with signature checks disabled:

**Option 1: Use Firefox Developer Edition or Nightly**
- Download and install [Firefox Developer Edition](https://www.mozilla.org/firefox/developer/) or [Firefox Nightly](https://www.mozilla.org/firefox/nightly/).
- These versions allow you to load unsigned extensions permanently via `about:debugging` or by setting the `xpinstall.signatures.required` preference to `false` in `about:config`.

**Option 2: Disable Signature Requirement (Advanced)**
- Start Firefox with the signature check disabled (not recommended for daily use):
    1. Close Firefox.
    2. Start Firefox from the terminal with:
       ```bash
       firefox --allow-addon-sideload
       ```
    3. Or, in Developer/Nightly, go to `about:config` and set `xpinstall.signatures.required` to `false`.

> **Warning:** Disabling signature checks can reduce your browser's security. Only do this for development or testing purposes.

## Usage

1. Click the Safepass icon in your browser toolbar.
2. Adjust password settings as needed. The password is automatically regenerated with each change to the settings (such as length or character set).
3. If you want a different password with the current settings, click the "Regenerate" button to create a new one.
4. Copy the password to your clipboard by clicking the password field or by pressing the copy button.

## Autofill Instructions

Safepass can help you autofill passwords into login forms:

1. Navigate to the login page where you want to use a generated password.
2. Open the Safepass extension popup.
3. Generate or select your password.
4. Click the "Autofill" button (if available) or use the copy button, then paste the password into the password field.
5. For supported sites, Safepass will attempt to automatically fill the password field. If not, simply paste the password manually.

> Note: Autofill support may vary depending on the website and browser. Ensure you have granted the extension the necessary permissions if prompted.

## Development

- All extension source code is in the `chrome_extension/` and `firefox_extension/` folders.
- Shared components and services are organized for easy maintenance.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the Attribution-NonCommercial 4.0 International License.

[![Safepass](https://github.com/user-attachments/assets/065b62d0-397b-499d-bc0a-de9896ed8b69)](https://github.com/d3bvstack/Safepass)
