// Custom element for styled checkbox component
import getSharedStyles from './styles-loader.js';

class StyledCheckbox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._checked = false;
    this._id = `checkbox-${Math.random().toString(36).slice(2, 10)}`;
  }

  static get observedAttributes() {
    return ["checked", "label"];
  }

  get checked() {
    return this._checked;
  }
  set checked(val) {
    const boolVal = Boolean(val === true || val === "true" || val === 1);
    if (this._checked !== boolVal) {
      this._checked = boolVal;
      this._updateCheckboxState();
      this.setAttribute("checked", boolVal);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "checked") {
      this._checked = newValue !== null && newValue !== "false";
      this._updateCheckboxState();
    } else if (name === "label") {
      const labelElement = this.shadowRoot.querySelector(".checkbox-label");
      if (labelElement) labelElement.textContent = newValue || "";
    }
  }

  connectedCallback() {
    this._checked = this.hasAttribute("checked") && this.getAttribute("checked") !== "false";
    this._render();
    this._setupEventListeners();
    this._updateCheckboxState();
  }

  _updateCheckboxState() {
    const customCheckbox = this.shadowRoot.querySelector(".custom-checkbox");
    const labelElement = this.shadowRoot.querySelector(".checkbox-label");
    const nativeCheckbox = this.shadowRoot.querySelector(".native-checkbox");
    if (!customCheckbox || !labelElement || !nativeCheckbox) return;

    if (this._checked) {
      customCheckbox.classList.add("checked");
      customCheckbox.setAttribute("aria-checked", "true");
      labelElement.classList.add("checked");
    } else {
      customCheckbox.classList.remove("checked");
      customCheckbox.setAttribute("aria-checked", "false");
      labelElement.classList.remove("checked");
    }
    nativeCheckbox.checked = this._checked;
    nativeCheckbox.id = this._id;
    labelElement.setAttribute("for", this._id);
    labelElement.id = `${this._id}-label`;
    customCheckbox.setAttribute("aria-labelledby", `${this._id}-label`);
  }

  _render() {
    const label = this.getAttribute("label") || "";
    this.shadowRoot.innerHTML = `
      <style>
        ${getSharedStyles()}
        :host {
          display: block;
          padding: 8px 16px;
          border-bottom: 1px solid hsla(0, 0.00%, 34.10%, 0.07);
        }
        :host(:last-child) { border-bottom: none; }
        .checkbox-container {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          height: 28px;
          box-sizing: var(--box-sizing, border-box);
          position: relative;
        }
        .custom-checkbox-wrapper {
          position: relative;
          width: 24px;
          height: 24px;
          flex-shrink: 0;
        }
        .custom-checkbox {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: var(--border-radius, 4px);
          border: solid 2px var(--color-primary, #3064C7);
          background-color: white;
          transition: all var(--transition, 0.2s);
          box-sizing: var(--box-sizing, border-box);
          position: relative;
        }
        .custom-checkbox.checked {
          background-color: var(--color-primary, #3064C7);
          border-color: var(--color-primary, #3064C7);
        }
        .checkmark {
          stroke-dasharray: 30;
          stroke-dashoffset: 30;
          transition: stroke-dashoffset var(--transition, 0.3s) ease;
          opacity: 0;
        }
        .custom-checkbox.checked .checkmark {
          stroke-dashoffset: 0;
          opacity: 1;
        }
        .checkbox-container:hover .custom-checkbox {
          box-shadow: 0 0 0 3px rgba(48, 100, 199, 0.2);
        }
        .checkbox-container:focus-within .custom-checkbox {
          box-shadow: 0 0 0 3px rgba(48, 100, 199, 0.4);
          outline: none;
        }
        .custom-checkbox:focus-visible {
          outline: 2px solid var(--color-primary, #3064C7);
          outline-offset: 2px;
        }
        .checkbox-label {
          user-select: none;
          font-size: var(--font-size-sm, 0.9rem);
          transition: all var(--transition, 0.2s);
          color: var(--color-text, #333);
          line-height: 1.4;
          position: relative;
          padding-left: 2px;
          cursor: pointer;
        }
        .checkbox-label.checked {
          color: var(--color-primary, #3064C7);
          font-weight: 500;
          letter-spacing: 0.01em;
          text-shadow: 0 0 0.5px rgba(48, 100, 199, 0.2);
        }
        .checkbox-container:hover .checkbox-label {
          color: var(--color-primary, #3064C7);
          transform: translateX(2px);
          text-shadow: 0 0 1px rgba(48, 100, 199, 0.2);
        }
        .ripple {
          position: absolute;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          left: -8px;
          top: -8px;
          pointer-events: none;
          background-color: rgba(48, 100, 199, 0.3);
          transform: scale(0);
          animation: ripple 0.6s linear;
          opacity: 0;
        }
        @keyframes ripple {
          0% { transform: scale(0); opacity: 0.6; }
          100% { transform: scale(1); opacity: 0; }
        }
      </style>
      <div class="checkbox-container">
        <div class="custom-checkbox-wrapper">
          <input type="checkbox" class="native-checkbox" id="${this._id}" ${this._checked ? "checked" : ""}>
          <div class="custom-checkbox${this._checked ? " checked" : ""}" role="checkbox" aria-checked="${this._checked ? "true" : "false"}" tabindex="0" aria-labelledby="${this._id}-label">
            <svg class="checkmark" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M5 13l4 4L19 7" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <label class="checkbox-label" for="${this._id}" id="${this._id}-label">${label}</label>
      </div>
    `;
  }

  _setupEventListeners() {
    const nativeCheckbox = this.shadowRoot.querySelector(".native-checkbox");
    const customCheckbox = this.shadowRoot.querySelector(".custom-checkbox");
    const checkboxContainer = this.shadowRoot.querySelector(".checkbox-container");

    // Listen for native checkbox change
    nativeCheckbox.addEventListener("change", (e) => {
      this.checked = nativeCheckbox.checked;
      this._emitChange();
      this._createRippleEffect(e); // Add ripple on native change (for accessibility)
    });

    // Mouse click on custom checkbox
    customCheckbox.addEventListener("click", (e) => {
      this._createRippleEffect(e);
      nativeCheckbox.click(); // Triggers change event
    });

    // Make entire container clickable
    checkboxContainer.addEventListener("click", (e) => {
      // Only trigger if the click was directly on the container or label
      // and not on the checkbox itself (which has its own handler)
      if (e.target === checkboxContainer || e.target.classList.contains('checkbox-label')) {
        e.preventDefault();
        this._createRippleEffect(e);
        nativeCheckbox.click(); // Triggers change event
      }
    });

    // Keyboard toggle for custom checkbox (for accessibility)
    customCheckbox.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this._createRippleEffect(e);
        nativeCheckbox.click(); // Triggers change event
      }
    });

    // Focus/blur styling
    customCheckbox.addEventListener("focus", () => customCheckbox.classList.add("focused"));
    customCheckbox.addEventListener("blur", () => customCheckbox.classList.remove("focused"));
  }

  _emitChange() {
    this.dispatchEvent(new CustomEvent("change", {
      detail: { checked: this.checked },
      bubbles: true,
      composed: true,
    }));
  }

  _createRippleEffect(e) {
    const wrapper = this.shadowRoot.querySelector(".custom-checkbox-wrapper");
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    wrapper.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }
}

customElements.define("styled-checkbox", StyledCheckbox);
// Copyright (c) 2025 d3bvstack. All rights reserved.
// This file is part of the Safepass project and may not be copied or distributed without permission.
