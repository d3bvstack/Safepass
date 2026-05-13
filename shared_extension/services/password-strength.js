// Simple Password Strength Estimator: Time to Crack + Character Variety
// Returns an object with time to crack and character variety details

const COMMON_PASSWORDS = [
    'password', '123456', '12345678', 'qwerty', 'abc123', 
    'monkey', '1234567', 'letmein', 'trustno1', 'dragon', 
    'baseball', '111111', 'iloveyou', 'master', 'sunshine', 
    'ashley', 'bailey', 'passw0rd', 'shadow', '123123'
];

function getCharacterVariety(password) {
    return {
        hasLowercase: /[a-z]/.test(password),
        hasUppercase: /[A-Z]/.test(password),
        hasNumbers: /[0-9]/.test(password),
        hasSymbols: /[^A-Za-z0-9_]/.test(password),
    };
}

function getCharsetSize(variety) {
    let size = 0;
    if (variety.hasLowercase) size += 26;
    if (variety.hasUppercase) size += 26;
    if (variety.hasNumbers) size += 10;
    if (variety.hasSymbols) size += 33; // Approximate common symbols
    return size;
}

function estimateTimeToCrack(password, guessesPerSecond = 1_000_000_000) {
    if (!password) return { seconds: 0, text: 'N/A' };
    if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
        return { seconds: 0, text: 'Instant (common password)' };
    }
    const variety = getCharacterVariety(password);
    const charsetSize = getCharsetSize(variety);
    const possibilities = Math.pow(charsetSize, password.length);
    const seconds = possibilities / (2 * guessesPerSecond);
    let text;
    if (seconds < 1) text = '< 1 second';
    else if (seconds < 60) text = `${Math.floor(seconds)} seconds`;
    else if (seconds < 3600) text = `${Math.floor(seconds / 60)} minutes`;
    else if (seconds < 86400) text = `${Math.floor(seconds / 3600)} hours`;
    else if (seconds < 31536000) text = `${Math.floor(seconds / 86400)} days`;
    else text = `${Math.floor(seconds / 31536000)} years`;
    return { seconds, text };
}

class SimplePasswordStrength {
    evaluate(password) {
        const variety = getCharacterVariety(password);
        const timeToCrack = estimateTimeToCrack(password);
        return {
            password,
            timeToCrack,
            characterVariety: variety,
            length: password.length
        };
    }
}

const passwordStrengthCalculator = new SimplePasswordStrength();
export default passwordStrengthCalculator;
// Copyright (c) 2025 d3bvstack. All rights reserved.
// Attribution: d3bvstack, 2025.
