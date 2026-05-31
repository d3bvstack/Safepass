/**
 * HTML Sanitization Utilities
 * 
 * Simple functions to prevent XSS attacks when handling user-controlled content.
 * For complex HTML, consider using DOMPurify library.
 */

/**
 * Escape HTML special characters to prevent XSS in text contexts
 * @param {string} text - The text to escape
 * @returns {string} Escaped text safe for HTML context
 */
export function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, char => map[char]);
}

/**
 * Escape HTML for use in HTML attributes
 * @param {string} text - The text to escape
 * @returns {string} Escaped text safe for attribute context
 */
export function escapeHtmlAttribute(text) {
  return String(text).replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

/**
 * Sanitize text for safe insertion via textContent
 * textContent is the safest way to set dynamic text as it never parses HTML
 * @param {string} text - The text to sanitize
 * @returns {string} Text safe for textContent assignment
 */
export function sanitizeForText(text) {
  // textContent is safe - it never parses HTML
  // Just ensure we return a string
  return String(text || '');
}

/**
 * Create a safe text node (safest approach)
 * @param {string} text - The text content
 * @returns {Text} A text node safe from XSS
 */
export function createTextNode(text) {
  return document.createTextNode(String(text || ''));
}
