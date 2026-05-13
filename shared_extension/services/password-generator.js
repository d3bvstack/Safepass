// Password Generator Service
class PasswordGenerator {
  constructor() {
    // Character sets for password generation
    this.lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    this.upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.numericChars = '0123456789';
    this.specialChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    // Fallback common words (legacy)
    this.commonWords = [
      'apple', 'banana', 'sunset', 'mountain', 'river', 'ocean', 'forest', 'desert', 
      'cloud', 'storm', 'thunder', 'lightning', 'rain', 'snow', 'wind', 'sun', 'moon', 
      'star', 'planet', 'galaxy', 'universe', 'earth', 'water', 'fire', 'air', 'metal', 
      'wood', 'stone', 'tree', 'flower', 'grass', 'bird', 'fish', 'tiger', 'lion', 
      'bear', 'wolf', 'fox', 'deer', 'rabbit', 'mouse', 'book', 'paper', 'pen', 'ink', 
      'desk', 'chair', 'table', 'window', 'door', 'room', 'house', 'building', 'street',
      'road', 'path', 'bridge', 'tunnel', 'garden', 'field', 'music', 'song', 'sound',
      'color', 'light', 'shadow', 'dream', 'idea', 'thought', 'mind', 'heart', 'soul'
    ];
    this.effWords = null;
    this._loadEffWordlist();
  }

  async _loadEffWordlist() {
    try {
      const response = await fetch('services/eff_large_wordlist.txt');
      if (!response.ok) throw new Error('Failed to load EFF wordlist');
      const text = await response.text();
      // Remove dice numbers, keep only the word (tab or space separated)
      this.effWords = text.split(/\r?\n/)
        .map(line => line.replace(/^\d+\s+/, '').trim())
        .filter(w => w && !w.startsWith('#'));
    } catch (e) {
      this.effWords = null;
    }
  }

  // Generate a random password based on options
  generatePassword(options) {
    const {
      length = 12,
      includeLowercase = true,
      includeUppercase = true,
      includeNumbers = true,
      includeSpecial = true,
      requireAll = true,
      excludeSimilar = false,
      excludeAmbiguous = false
    } = options;

    // Create character pool based on selected options
    let charPool = '';
    let requiredChars = [];

    // Add character sets based on options
    if (includeLowercase) {
      let chars = this.lowerCaseChars;
      if (excludeSimilar) {
        chars = chars.replace(/[il1]/g, '');
      }
      charPool += chars;
      requiredChars.push(this._getRandomChar(chars));
    }

    if (includeUppercase) {
      let chars = this.upperCaseChars;
      if (excludeSimilar) {
        chars = chars.replace(/[IO0]/g, '');
      }
      charPool += chars;
      requiredChars.push(this._getRandomChar(chars));
    }

    if (includeNumbers) {
      let chars = this.numericChars;
      if (excludeSimilar) {
        chars = chars.replace(/[01]/g, '');
      }
      charPool += chars;
      requiredChars.push(this._getRandomChar(chars));
    }

    if (includeSpecial) {
      let chars = this.specialChars;
      if (excludeAmbiguous) {
        chars = chars.replace(/[\{\}\[\]\(\)\/\\'"~,;:<>]/g, '');
      }
      charPool += chars;
      requiredChars.push(this._getRandomChar(chars));
    }

    // If no character sets are selected, default to lowercase
    if (charPool === '') {
      charPool = this.lowerCaseChars;
      requiredChars = [this._getRandomChar(this.lowerCaseChars)];
    }

    // Generate random password
    let password = '';
    
    // If we require all character types, include required characters
    if (requireAll && requiredChars.length > 0) {
      password = requiredChars.join('');
      
      // Fill the rest with random characters
      for (let i = password.length; i < length; i++) {
        password += this._getRandomChar(charPool);
      }
      
      // Shuffle the password to mix the required characters
      password = this._shuffleString(password);
      
      // Trim to exact length (in case we added too many required chars)
      password = password.substring(0, length);
    } else {
      // Simple random generation
      for (let i = 0; i < length; i++) {
        password += this._getRandomChar(charPool);
      }
    }

    return password;
  }

  // Generate a passphrase based on options
  async generatePassphrase(options) {
    const {
      wordCount = 4,
      separator = '-',
      capitalize = false,
      includeNumbers = false,
      includeSpecial = false
    } = options;

    let wordSource = this.effWords && this.effWords.length > 1000 ? this.effWords : this.commonWords;
    // If EFF wordlist is not loaded yet, wait for it (max 1s)
    if (!this.effWords) {
      await new Promise(r => setTimeout(r, 100));
      if (!this.effWords) wordSource = this.commonWords;
      else wordSource = this.effWords;
    }

    let passphrase = [];
    for (let i = 0; i < wordCount; i++) {
      let word = this._getRandomItem(wordSource);
      if (capitalize) word = word.charAt(0).toUpperCase() + word.slice(1);
      passphrase.push(word);
    }
    if (includeNumbers) {
      const randomPosition = Math.floor(Math.random() * wordCount);
      const randomNumber = Math.floor(Math.random() * 100);
      passphrase[randomPosition] = passphrase[randomPosition] + randomNumber;
    }
    if (includeSpecial) {
      const randomPosition = Math.floor(Math.random() * wordCount);
      const randomSpecial = this._getRandomChar('!@#$%^&*');
      passphrase[randomPosition] = passphrase[randomPosition] + randomSpecial;
    }
    return passphrase.join(separator);
  }

  // Helper functions
  _getRandomChar(charSet) {
    return charSet.charAt(Math.floor(Math.random() * charSet.length));
  }
  
  _getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  _shuffleString(str) {
    const array = str.split('');
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
  }
}

// Create singleton instance
const passwordGenerator = new PasswordGenerator();

// Export the singleton
export default passwordGenerator;
// Copyright (c) 2025 d3bvstack. All rights reserved.
// This file is part of the Safepass project and may not be copied or distributed without permission.
