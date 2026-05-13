// StrengthBadge custom element: displays a badge for password/passphrase strength
import getSharedStyles from './styles-loader.js';

/**
 * @element strength-badge
 * @summary Badge indicating password/passphrase strength visually and textually.
 */
class StrengthBadge extends HTMLElement {  
  static #colorSchemes = {
    weak:   { badge: "#FFE4E4", text: "#FF4141", icon: "#FF4141", border: "#FFCACA" },
    medium: { badge: "#FFF1E0", text: "#FF9B42", icon: "#FF9B42", border: "#FFE0C0" },
    strong: { badge: "#E1F3E1", text: "#29D243", icon: "#29D243", border: "#C5E9C5" },
  };  
  static #strengthText = {
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
  };
  
  #prevStrength = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  static get observedAttributes() {
    return ["strength", "data-feedback"];
  }  
  attributeChangedCallback(name, oldValue, newValue) {
    if ((name === "strength" || name === "data-feedback") && oldValue !== newValue) {
      if (name === "strength") {
        this.#prevStrength = oldValue;
      }
      this.#render();
    }
  }
  connectedCallback() {
    this.#render();
    
    // After initial render, add a small delay then animate in the bar
    setTimeout(() => {
      const strengthFill = this.shadowRoot.querySelector('.strength-fill');
      if (strengthFill) {
        const strength = (this.getAttribute("strength") || "strong").toLowerCase();
        const getWidthFromStrength = (str) => {
          switch(str) {
            case 'weak': return '33%';
            case 'medium': return '66%';
            case 'strong': return '100%';
            default: return '0%';
          }
        };
        strengthFill.style.width = getWidthFromStrength(strength);
      }
    }, 100);
  }
  /**
   * Render the badge based on the current strength attribute
   * @private
   */  
  #render() {
    const strength = (this.getAttribute("strength") || "strong").toLowerCase();
    const colors = StrengthBadge.#colorSchemes[strength] || StrengthBadge.#colorSchemes.strong;
    const text = StrengthBadge.#strengthText[strength] || StrengthBadge.#strengthText.strong;
    const feedback = this.getAttribute("data-feedback") || ""; 
    
    // Process feedback to make it more concise
    const conciseFeedback = this.#processTooltipFeedback(feedback, strength);
    
    // First-time initialization of the shadow DOM content
    if (!this.shadowRoot.firstChild) {
      this.shadowRoot.innerHTML = `
        <style>
          ${getSharedStyles()}
          :host {
            display: block;
            width: 100%;
          }
          .strength-container {
            display: flex;
            flex-direction: column;
            width: 100%;
            gap: 8px;
            position: relative;
          }
          .strength-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }
          .strength-badge {
            padding: 4px 10px;
            border-radius: var(--border-radius-lg, 12px);
            font-size: 13px;
            font-family: var(--font-family-base, 'Roboto', sans-serif);
            font-weight: 500;
            line-height: 1;
            background-color: ${colors.badge};
            color: ${colors.text};
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 60px;
            text-align: center;
            transition: all 0.6s ease;
            will-change: background-color, color, opacity, border-color;
            transform: translateZ(0);
            border: 1px solid ${colors.border};
            cursor: help;
            position: relative;
          }
          .strength-bar {
            width: 100%;
            height: 4px;
            background: #E0E0E0;
            border-radius: 2px;
            overflow: hidden;
            position: relative;
            margin-bottom: 4px;
          }
          .strength-fill {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 0%;
            background: ${colors.icon};
            border-radius: 2px;
            transition: width 0.8s cubic-bezier(0.25, 1, 0.5, 1), 
                        background-color 0.8s ease;
            will-change: width, background-color;
            transform: translateZ(0);
          }
          .strength-tooltip {
            position: absolute;
            bottom: 100%; 
            left: 0;
            margin-bottom: 10px;
            background-color: #333;
            color: #fff;
            border-radius: var(--border-radius, 4px);
            padding: 8px 12px;
            font-size: 12px;
            line-height: 1.4;
            z-index: 100;
            box-shadow: var(--color-shadow, 0 2px 10px rgba(0,0,0,0.2));
            max-width: 250px;
            opacity: 0;
            visibility: hidden;
            transition: opacity var(--transition, 0.2s), visibility var(--transition, 0.2s);
            text-align: left;
            pointer-events: none;
          }
          .strength-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 30px;
            border-width: 5px;
            border-style: solid;
            border-color: #333 transparent transparent transparent;
          }
          .strength-badge:hover + .strength-tooltip {
            opacity: 1;
            visibility: visible;
          }
        </style>
        <div class="strength-container">
          <div class="strength-bar">
            <div class="strength-fill"></div>
          </div>
          <div class="strength-row">
            <div class="strength-badge">${text}</div>
            <div class="strength-tooltip">${conciseFeedback}</div>
          </div>
        </div>
      `;
    }

    // Get references to the elements we'll update
    const strengthFill = this.shadowRoot.querySelector('.strength-fill');
    const strengthBadge = this.shadowRoot.querySelector('.strength-badge');
    const strengthTooltip = this.shadowRoot.querySelector('.strength-tooltip');    
    // Update based on current strength
    const getWidthFromStrength = (str) => {
      switch(str) {
        case 'weak': return '33%';
        case 'medium': return '66%';
        case 'strong': return '100%';
        default: return '0%';
      }
    };
    // For a more pleasing animation, update text first then animate the bar
    if (strengthBadge && strengthFill) {
      // Fade out badge, change it, fade it back in
      strengthBadge.style.opacity = '0';
      setTimeout(() => {
        strengthBadge.textContent = text;
        strengthBadge.style.backgroundColor = colors.badge;
        strengthBadge.style.color = colors.text;
        strengthBadge.style.borderColor = colors.border;
        strengthBadge.style.opacity = '1';
      }, 300);
      
      // Update fill color and width
      strengthFill.style.backgroundColor = colors.icon;
      // Add a tiny delay to make the animation more noticeable
      setTimeout(() => {
        strengthFill.style.width = getWidthFromStrength(strength);
      }, 100);
      
      // Update the tooltip text
      if (strengthTooltip) {
        // Process the feedback to be concise before setting it
        strengthTooltip.textContent = this.#processTooltipFeedback(feedback, strength);
      }
    }
  }
  
  /**
   * Process the feedback to make it minimal and concise
   * @private
   * @param {string} feedback - Original feedback string
   * @param {string} strength - Current strength level
   * @returns {string} - Processed concise feedback
   */
  #processTooltipFeedback(feedback, strength) {
    if (!feedback) return "";
    const feedbackItems = feedback.split('. ').filter(item => item);
    let header = '';
    let body = [];
    if (strength === 'weak') {
      header = 'Password Analysis:';
      // Show up to 3 critical or relevant feedbacks
      const critical = feedbackItems.filter(item => 
        item.includes('common') || 
        item.includes('cracked') || 
        item.includes('too short') || 
        item.includes('Add more characters')
      );
      body = (critical.length > 0 ? critical : feedbackItems).slice(0, 3);
    } else if (strength === 'medium') {
      header = 'How to improve:';
      // Show up to 3 improvement suggestions
      const improvements = feedbackItems.filter(item => 
        item.includes('Add') || 
        item.includes('longer') ||
        item.includes('Avoid')
      );
      body = (improvements.length > 0 ? improvements : feedbackItems).slice(0, 3);
    } else if (strength === 'strong') {
      header = 'Great password!';
      // Show main positive message and up to 2 more positive notes
      const positive = feedbackItems.filter(item => 
        item.includes('Excellent') || 
        item.includes('Good') ||
        item.includes('strong')
      );
      if (positive.length > 0) {
        body = [positive[0], ...positive.slice(1, 3)];
      } else {
        body = [feedbackItems[0]];
      }
    }
    // Compose the tooltip
    return `${header}\n${body.join('\n')}`;
  }
}

// Register the custom element
customElements.define("strength-badge", StrengthBadge);
// Attribution: d3bvstack, 2025.
