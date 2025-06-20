![Safepass Popup](https://private-user-images.githubusercontent.com/180553755/457492188-05a10d13-8e09-44c4-9cfc-59236bf5d3df.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTA0NDkwOTksIm5iZiI6MTc1MDQ0ODc5OSwicGF0aCI6Ii8xODA1NTM3NTUvNDU3NDkyMTg4LTA1YTEwZDEzLThlMDktNDRjNC05Y2ZjLTU5MjM2YmY1ZDNkZi5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwNjIwJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDYyMFQxOTQ2MzlaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT04NmE0MjNjNmMyYzY5ZWU1YTE2YjEyZGM0NGFlNDU4MWViMjk0NmU2ZGMwODYxMmViMTExYTIyZGRjZGQyMGIxJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.ISamADgfUtbFL6lAtX3PCgj_amJaJ6P0uFKnNMneZ5U)

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

1. Go to `chrome_extension/` directory.
2. Open [chrome://extensions](chrome://extensions) in your browser.
3. Enable "Developer mode".
4. Click "Load unpacked" and select the `chrome_extension/` folder.

### Firefox

1. Go to `firefox_extension/` directory.
2. Open [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox) in your browser.
3. Click "Load Temporary Add-on" and select the `manifest.json` file in the `firefox_extension/` folder.

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

This project is licensed under the MIT License.
![Safepass Overview](https://private-user-images.githubusercontent.com/180553755/457492188-05a10d13-8e09-44c4-9cfc-59236bf5d3df.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTA0NDkwOTksIm5iZiI6MTc1MDQ0ODc5OSwicGF0aCI6Ii8xODA1NTM3NTUvNDU3NDkyMTg4LTA1YTEwZDEzLThlMDktNDRjNC05Y2ZjLTU5MjM2YmY1ZDNkZi5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwNjIwJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDYyMFQxOTQ2MzlaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT04NmE0MjNjNmMyYzY5ZWU1YTE2YjEyZGM0NGFlNDU4MWViMjk0NmU2ZGMwODYxMmViMTExYTIyZGRjZGQyMGIxJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.ISamADgfUtbFL6lAtX3PCgj_amJaJ6P0uFKnNMneZ5U)