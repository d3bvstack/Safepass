[![Safepass](https://github.com/user-attachments/assets/065b62d0-397b-499d-bc0a-de9896ed8b69)](https://github.com/d3bvstack/Safepass)

# Safepass

Safepass is a secure, open-source password generator browser extension available for Chrome and Firefox. It helps you create strong, customizable passwords with ease.

## Features

- Generate strong, random passwords
- Customizable password length and character sets
- Autofill
- User-friendly interface
- Password strength indicator
- Supports both Chrome and Firefox browsers

## Installation

### Firefox

**Automatic Install**  

[![Get it on Firefox Add-ons](https://github.com/user-attachments/assets/0dd140e6-750d-4b1d-a658-95f2df9fc82c)](https://addons.mozilla.org/es-ES/firefox/addon/safepass/)

**Manual Installation**

1. Download the latest Firefox artifact (`safepass-firefox-<sha>.xpi`) from the [Releases](https://github.com/d3bvstack/Safepass/releases) page.
2. In Firefox, open the Add-ons and Themes Manager by pressing `Ctrl+Shift+A`.
3. Click the gear icon (⚙️) in the top right corner and select “Install Add-on From File…”.
4. Locate and select the downloaded `.xpi` file to install the extension.

### Chrome

**Manual Install**

1. Download the latest Chrome artifact (`safepass-chrome-<sha>.zip`) from the [Releases](https://github.com/d3bvstack/Safepass/releases) page.
2. Open [chrome://extensions](chrome://extensions) in your browser.
3. Enable **Developer mode** (top right corner).
4. Drag and drop the `chrome_extension.zip` file onto the Chrome Extensions page to install.

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

Safepass now uses one shared source of truth for Chrome and Firefox, with only browser-exclusive files kept separate.

### Source Layout

- `shared_extension/`: Common source used by both browsers
- `browser_specific/chrome/`: Chrome-exclusive files
- `browser_specific/firefox/`: Firefox-exclusive files
- `build/chrome_extension/`: Generated Chrome target folder (sync output)
- `build/firefox_extension/`: Generated Firefox target folder (sync output)

### Browser-Exclusive Files

Only these files are intentionally different between browsers:

- `browser_specific/chrome/manifest.json`
- `browser_specific/firefox/manifest.json`
- `browser_specific/chrome/components/footer-buttons.js`
- `browser_specific/firefox/components/footer-buttons.js`

### Sync Workflow

1. Edit common code in `shared_extension/`.
2. Edit browser-only files in `browser_specific/chrome/` or `browser_specific/firefox/`.
3. Regenerate target extension folders:

```bash
./scripts/sync-extensions.sh
```

4. Verify there is no drift:

```bash
./scripts/sync-extensions.sh --check
```

Do not edit generated files directly in `build/chrome_extension/` or `build/firefox_extension/`; those folders are materialized by the sync script.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the Attribution-NonCommercial 4.0 International License.

[![Safepass](https://github.com/user-attachments/assets/065b62d0-397b-499d-bc0a-de9896ed8b69)](https://github.com/d3bvstack/Safepass)
