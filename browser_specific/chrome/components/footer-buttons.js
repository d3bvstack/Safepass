// Custom element for footer buttons component
import getSharedStyles from './styles-loader.js';

class FooterButtons extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this._render();
    this._setupEventListeners();
  }

  _render() {
    this.shadowRoot.innerHTML = `
      <style>
        ${getSharedStyles()}
        :host {
          display: block;
          width: 100%;
        }
        .footer-buttons-container {
          display: flex;
          width: 100%;
          gap: 8px;
        }
        .autofill-button-container,
        .copy-button-container {
          flex: 1 1 0;
          height: 44px;
          border-radius: var(--border-radius, 4px);
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }
        .autofill-button-container {
          background: var(--color-secondary, #EFF5FF);
          outline: 1px #D4E3FF solid;
          outline-offset: -1px;
          transition: background 0.18s cubic-bezier(.4,0,.2,1);
        }
        .autofill-button-container:hover {
          background: #e6f0fa;
        }
        .autofill-button-container:active {
          background: #d2e4f7;
        }
        .copy-button-container {
          background: linear-gradient(202deg, var(--color-primary-light, #3369CE) 0%, var(--color-primary-dark, #2757B2) 100%);
          transition: background 0.18s cubic-bezier(.4,0,.2,1);
        }
        .copy-button-container:hover {
          background: linear-gradient(202deg, #3a6fd1 0%, #2a4e9c 100%);
        }
        .copy-button-container:active {
          background: linear-gradient(202deg, #295bb7 0%, #1e3977 100%);
        }
        /* Remove text animation on click */
        .copy-button.animate,
        .autofill-button.animate {
          /* animation: none; */
        }
        /* Remove keyframes for bounce */
        .button {
          flex: 1 1 0;
          height: 44px;
          padding: 8px;
          border-radius: var(--border-radius, 4px);
          border: none;
          background: transparent;
          cursor: pointer;
          font-family: var(--font-family-base, 'Roboto', sans-serif);
          font-weight: 600;
          font-size: 12.08px;
          line-height: 16.72px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          overflow: hidden;
        }
        .autofill-text {
          color: var(--color-primary, #3064C7);
          word-wrap: break-word;
        }
        .copy-text {
          color: white;
          word-wrap: break-word;
        }
      </style>
      <div class="footer-buttons-container">
        <div class="autofill-button-container">
          <button class="button autofill-button" aria-label="Autofill password into the current field">
            <span class="autofill-text">Autofill</span>
          </button>
        </div>
        <div class="copy-button-container">
          <button class="button copy-button" aria-label="Copy password to clipboard">
            <span class="copy-text">Copy</span>
          </button>
        </div>
      </div>
    `;
  }

  _setupEventListeners() {
    // Use optional chaining for safety
    const autofillBtn = this.shadowRoot.querySelector(".autofill-button");
    if (autofillBtn) {
      autofillBtn.addEventListener("click", () => {
        autofillBtn.classList.remove("animate");
        void autofillBtn.offsetWidth;
        autofillBtn.classList.add("animate");
        this.dispatchEvent(new CustomEvent("autofill-clicked", { bubbles: true, composed: true }));
      });
    }
    const copyBtn = this.shadowRoot.querySelector(".copy-button");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        copyBtn.classList.remove("animate");
        void copyBtn.offsetWidth;
        copyBtn.classList.add("animate");
        this.dispatchEvent(new CustomEvent("copy-clicked", { bubbles: true, composed: true }));
      });
    }
  }
}

// Register the custom element
customElements.define("footer-buttons", FooterButtons);
// Attribution: d3bvstack, 2025.
