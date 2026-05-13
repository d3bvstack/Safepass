/**
 * Custom element for password container component
 */
import getSharedStyles from './styles-loader.js';

class PasswordContainer extends HTMLElement {
  /** @type {string} */
  #inputValue = "";
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["placeholder"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "placeholder" && oldValue !== newValue) {
      this.#updatePlaceholder(newValue);
    }
  }

  connectedCallback() {
    this.#render();
    this.#setupEventListeners();
  }

  /**
   * Render the component's shadow DOM
   */
  #render() {
    const placeholder = this.getAttribute("placeholder") || "";
    this.shadowRoot.innerHTML = `      <style>
        ${getSharedStyles()}
        :host {
          display: block;
          width: 100%;
          max-width: 100%;
          position: relative;
          box-sizing: var(--box-sizing, border-box);
          overflow: hidden;
        }
        .password-container {
          align-self: stretch;
          height: 52px;
          padding: 4px;
          background: var(--color-secondary, #EFF5FF);
          box-shadow: 0px 0.59px 10.81px rgba(0, 0, 0, 0) inset;
          overflow: hidden;
          border-radius: var(--border-radius, 4px);
          justify-content: space-between;
          align-items: center;
          gap: 4px;
          display: flex;
          position: relative;
          width: 100%;
          max-width: 100%;
          box-sizing: var(--box-sizing, border-box);
        }
        .output-container {
          flex: 1 1 0;
          align-self: stretch;
          border-radius: var(--border-radius, 4px);
          justify-content: center;
          align-items: center;
          gap: 8px;
          display: flex;
        }
        .input-field {
          flex: 1;
          height: 100%;
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          font-family: var(--font-family-base, 'Roboto', sans-serif);
          font-size: var(--font-size-base, 16px);
          color: #9DB3DD;
          font-weight: 400;
          line-height: 27.10px;
          word-wrap: break-word;
          box-sizing: var(--box-sizing, border-box);
          width: 100%;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          cursor: pointer;
          transition: color var(--transition, 0.2s) ease;
        }
        .input-field.copied {
          color: var(--color-primary, #3064C7);
        }
        .input-field:focus {
          outline: none;
        }
        .copy-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.82);
          border-radius: var(--border-radius, 4px);
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 5;
        }
        .copy-overlay.visible {
          opacity: 1;
        }
        .copy-message {
          background: linear-gradient(135deg, var(--color-primary-light, #3369CE), var(--color-primary-dark, #2757B2));
          color: white;
          padding: 6px 16px;
          border-radius: var(--border-radius-lg, 20px);
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.3px;
          box-shadow: var(--color-shadow, 0 4px 12px rgba(48, 100, 199, 0.3));
          position: relative;
          overflow: hidden;
          transform: translateY(0);
          transition: transform var(--transition, 0.2s) ease, box-shadow var(--transition, 0.2s) ease;
        }
        .copy-overlay.visible .copy-message {
          animation: pill-pop 0.3s ease forwards;
        }
        .copy-message::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 5px;
          height: 5px;
          background: rgba(255, 255, 255, 0.7);
          opacity: 0;
          border-radius: 100%;
          transform: scale(1, 1) translate(-50%, -50%);
          transform-origin: 0% 0%;
        }
        .copy-overlay.visible .copy-message::after {
          animation: ripple 0.8s ease-out;
        }
        @keyframes ripple {
          0% {
            transform: scale(0, 0);
            opacity: 0.7;
          }
          20% {
            transform: scale(25, 25);
            opacity: 0.5;
          }
          100% {
            opacity: 0;
            transform: scale(40, 40);
          }
        }
        @keyframes pill-pop {
          0% { transform: scale(0.8); opacity: 0; }
          40% { transform: scale(1.1); opacity: 1; }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        .action-button {
          aspect-ratio: 1 / 1;
          height: 100%;
          background: linear-gradient(to bottom right, var(--color-primary-light, #3369CE), var(--color-primary-dark, #2757B2));
          border: none;
          border-radius: var(--border-radius, 4px);
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;
          margin-left: auto;
        }
        .action-button:hover {
          background: linear-gradient(to bottom right, #2F61C3, #2349A3);
        }
        .action-button svg {
          width: 24px;
          height: 24px;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .action-button svg.spinning {
          animation: spin-dynamic 0.45s cubic-bezier(0.7,0,0.3,1) 0s 1;
        }
        @keyframes spin-dynamic {
          0% { transform: rotate(0deg) scale(1); }
          60% { transform: rotate(340deg) scale(1.15); }
          80% { transform: rotate(370deg) scale(0.97); }
          100% { transform: rotate(360deg) scale(1); }
        }
      </style>      <div class="password-container">
        <div class="output-container">
          <input type="text" class="input-field" placeholder="${placeholder}" readonly>
          <div class="copy-overlay">
            <span class="copy-message">Copied!</span>
          </div>
        </div>
        <button class="action-button" aria-label="Regenerate password">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.0216 20.3392C9.7318 20.3392 7.7682 19.5406 6.1309 17.9435C4.4935 16.3463 3.6749 14.417 3.6749 12.1555V11.9662L2.2869 13.3542L0.7456 11.799L4.9999 7.5305L9.2541 11.799L7.7129 13.3542L6.3249 11.9662V12.113C6.3249 13.6571 6.8794 14.9725 7.9884 16.0592C9.0975 17.1457 10.4419 17.689 12.0216 17.689C12.4833 17.689 12.9342 17.632 13.3744 17.518C13.8145 17.4038 14.244 17.2325 14.6629 17.0042L16.6009 18.9282C15.9017 19.389 15.1669 19.7394 14.3966 19.9792C13.6263 20.2192 12.8346 20.3392 12.0216 20.3392ZM19.0141 16.4837L14.7456 12.2292L16.3009 10.674L17.6889 12.062V11.9152C17.6889 10.371 17.132 9.0556 16.0184 7.969C14.9045 6.8825 13.5578 6.3392 11.9781 6.3392C11.5164 6.3392 11.0655 6.3962 10.6254 6.5102C10.1852 6.6244 9.7557 6.7956 9.3369 7.024L7.4129 5.0857C8.1122 4.6249 8.8446 4.2769 9.6101 4.0417C10.3758 3.8065 11.1651 3.689 11.9781 3.689C14.2679 3.689 16.2339 4.4875 17.8759 6.0847C19.518 7.6819 20.3391 9.6112 20.3391 11.8727V12.062L21.7129 10.674L23.2684 12.2292L19.0141 16.4837Z" fill="white"/>
          </svg>
        </button>
      </div>
    `;
  }

  /**
   * Set up event listeners for the component
   */
  #setupEventListeners() {
    const inputField = this.shadowRoot.querySelector(".input-field");
    const actionButton = this.shadowRoot.querySelector(".action-button");
    const outputContainer = this.shadowRoot.querySelector(".output-container");
    const copyOverlay = this.shadowRoot.querySelector(".copy-overlay");

    inputField.addEventListener("keydown", (e) => {
      if (e.key !== 'Tab') e.preventDefault();
    });

    outputContainer.addEventListener("click", () => {
      if (this.#inputValue) {
        navigator.clipboard.writeText(this.#inputValue)
          .then(() => {
            inputField.classList.add("copied");
            copyOverlay.classList.add("visible");
            setTimeout(() => {
              inputField.classList.remove("copied");
              copyOverlay.classList.remove("visible");
            }, 1000);
          })
          .catch(err => {
            console.error('Failed to copy text: ', err);
          });
      }
    });

    inputField.addEventListener("input", (e) => {
      this.#inputValue = e.target.value;
      this.dispatchEvent(
        new CustomEvent("input-changed", {
          detail: { value: this.#inputValue },
          bubbles: true,
          composed: true,
        })
      );
    });

    const svgIcon = actionButton.querySelector('svg');
    actionButton.addEventListener("click", () => {
      if (svgIcon) {
        svgIcon.classList.remove("spinning"); // reset if needed
        // Force reflow to restart animation
        void svgIcon.offsetWidth;
        svgIcon.classList.add("spinning");
        setTimeout(() => svgIcon.classList.remove("spinning"), 450);
      }
      this.dispatchEvent(
        new CustomEvent("regenerate-clicked", {
          detail: { value: this.#inputValue },
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  /**
   * Update the input placeholder
   * @param {string} placeholder
   */
  #updatePlaceholder(placeholder) {
    const inputField = this.shadowRoot.querySelector(".input-field");
    if (inputField) inputField.placeholder = placeholder;
  }

  /**
   * Get the current input value
   * @returns {string}
   */
  getValue() {
    return this.#inputValue;
  }

  /**
   * Set the input value
   * @param {string} value
   */
  setValue(value) {
    this.#inputValue = value;
    const inputField = this.shadowRoot.querySelector(".input-field");
    if (inputField) inputField.value = value;
  }
}

customElements.define("password-container", PasswordContainer);
// Attribution: d3bvstack, 2025.
