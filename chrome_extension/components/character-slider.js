import getSharedStyles from './styles-loader.js';

// Refactored CharacterSlider custom element for clarity and maintainability
class CharacterSlider extends HTMLElement {
  static get observedAttributes() {
    return ["value", "min", "max", "label"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._value = 62;
    this._min = 0;
    this._max = 100;
    this._label = "Number of characters";
    this._uniqueId = Math.random().toString(36).substring(2, 10);
  }

  get value() {
    return this._value;
  }
  set value(val) {
    const numVal = Number(val);
    if (!isNaN(numVal) && numVal !== this._value) {
      this._value = numVal;
      this.setAttribute("value", this._value);
      this._update();
      this._dispatchValueChanged();
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch (name) {
      case "value":
        this._value = Number(newValue);
        break;
      case "min":
        this._min = Number(newValue);
        break;
      case "max":
        this._max = Number(newValue);
        break;
      case "label":
        this._label = newValue;
        break;
    }
    this._update();
    this._setTrackColor();
  }

  connectedCallback() {
    this._render();
    this._setTrackColor();
  }

  _render() {
    const sliderId = `slider-${this._uniqueId}`;
    const valueInputId = `value-input-${this._uniqueId}`;
    this.shadowRoot.innerHTML = `
      <style>
        ${getSharedStyles()}
        :host {
          display: flex;
          flex-direction: column;
          padding-left: 1rem;
          padding-right: 1rem;
          position: relative;
        }
        .label {
          margin-bottom: 8px;
          color: #555;
          font-size: var(--font-size-sm, 0.9rem);
          text-align: left;
          transition: var(--transition, 0.2s);
          position: relative;
          cursor: pointer;
        }
        :host(:hover) .label {
          color: var(--color-primary);
          transform: translateY(-1px);
          text-shadow: 0 0 1px rgba(48, 100, 199, 0.2);
        }
        .slider-row {
          display: flex;
          padding-bottom: 0.5rem;
          align-items: center;
        }
        .separator {
          height: 1px;
          background-color: var(--color-divider);
          margin-top: 4px;
          margin-bottom: 4px;
          position: relative;
          left: -1rem;
          width: calc(100% + 2rem);
        }
        input[type="range"] {
          flex: 1;
          height: 0.5rem;
          margin-right: 18px;
          background: transparent;
          -webkit-appearance: none;
          appearance: none;
        }        input[type="range"]::-webkit-slider-runnable-track {
          height: 10px;
          border-radius: 5px;
          background: linear-gradient(
            to right,
            var(--color-primary) var(--percent, 0%),
            #e0e0e0 var(--percent, 0%)
          );
        }
        input[type="range"]::-moz-range-track {
          height: 10px;
          border-radius: 5px;
          background: linear-gradient(
            to right,
            var(--color-primary) var(--percent, 0%),
            #e0e0e0 var(--percent, 0%)
          );
        }
        input[type="range"]::-ms-fill-lower {
          background: var(--color-primary);
          border-radius: 5px;
        }
        input[type="range"]::-ms-fill-upper {
          background: #e0e0e0;
          border-radius: 5px;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--color-primary);
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
          border: none;
          margin-top: -8px;
          transition: background var(--transition, 0.2s);
        }
        input[type="range"]:focus::-webkit-slider-thumb {
          background: var(--color-primary-dark);
        }
        input[type="range"]::-moz-range-thumb {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--color-primary);
          cursor: pointer;
          border: none;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
        }
        input[type="range"]:focus::-moz-range-thumb {
          background: var(--color-primary-dark);
        }
        input[type="range"]::-ms-thumb {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--color-primary);
          cursor: pointer;
          border: none;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
          margin-top: 0;
        }
        input[type="range"]:focus {
          outline: none;
        }
        input[type="range"]:focus-visible {
          outline: 3px solid var(--color-primary);
          outline-offset: 3px;
        }
        input[type="range"]::-moz-focus-outer {
          border: 0;
        }
        .value-input {
          height: 1.75rem;
          padding: 0 0.5rem;
          background: #e0e9ff;
          border-radius: var(--border-radius);
          font-family: var(--font-family-base);
          font-size: var(--font-size-base);
          font-weight: 500;
          color: var(--color-primary);
          margin-left: 8px;
          width: auto;
          min-width: 3ch;
          box-sizing: var(--box-sizing);
          border: 1px solid transparent;
          text-align: center;
          outline: none;
          transition: border-color var(--transition), background-color var(--transition), width 0.15s;
          -moz-appearance: textfield;
        }
        .value-input::-webkit-outer-spin-button,
        .value-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .value-input:focus {
          border-color: var(--color-primary);
          background-color: #f5f8ff;
          outline: 2px solid var(--color-primary);
          outline-offset: 1px;
        }
        .value-input:focus-visible {
          outline: 3px solid var(--color-primary);
          outline-offset: 1px;
        }
        @media (max-width: 500px) {
          .value-input {
            font-size: var(--font-size-base);
            height: 28px;
            width: auto;
            min-width: 3ch;
          }
          input[type="range"]::-webkit-slider-thumb,
          input[type="range"]::-moz-range-thumb,
          input[type="range"]::-ms-thumb {
            width: 24px;
            height: 24px;
          }
          input[type="range"]::-webkit-slider-thumb {
            margin-top: -7px;
          }
        }
      </style>
      <label id="${sliderId}-label" for="${sliderId}" class="label">${this._label}</label>
      <div class="slider-row" role="group" aria-labelledby="${sliderId}-label">
        <input
          type="range"
          id="${sliderId}"
          min="${this._min}"
          max="${this._max}"
          value="${this._value}"
          aria-valuemin="${this._min}"
          aria-valuemax="${this._max}"
          aria-valuenow="${this._value}"
          aria-labelledby="${sliderId}-label"
        />
        <input 
          type="number" 
          id="${valueInputId}"
          class="value-input" 
          value="${this._value}" 
          min="${this._min}" 
          max="${this._max}"
          aria-label="${this._label} numeric value"
          aria-valuemin="${this._min}"
          aria-valuemax="${this._max}"
          aria-valuenow="${this._value}"
        />
      </div>
      <div class="separator"></div>
    `;
    this._bindEvents();
  }

  _bindEvents() {
    const range = this.shadowRoot.querySelector('input[type="range"]');
    const valueInput = this.shadowRoot.querySelector(".value-input");

    range.addEventListener("input", (e) => {
      this.value = e.target.value;
    });

    valueInput.addEventListener("input", (e) => {
      let newValue = Number(e.target.value);
      if (!isNaN(newValue)) {
        newValue = Math.max(this._min, Math.min(this._max, newValue));
        this.value = newValue;
      }
    });

    valueInput.addEventListener("blur", () => {
      valueInput.value = this._value;
    });

    valueInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        valueInput.blur();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        this.value = Math.min(this._value + 1, this._max);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        this.value = Math.max(this._value - 1, this._min);
      }
    });

    range.addEventListener("keydown", (e) => {
      if (["Home", "End", "PageUp", "PageDown", "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        let newValue = this._value;
        switch (e.key) {
          case "Home":
            newValue = this._min;
            break;
          case "End":
            newValue = this._max;
            break;
          case "PageUp":
            newValue = Math.min(this._value + 10, this._max);
            break;
          case "PageDown":
            newValue = Math.max(this._value - 10, this._min);
            break;
          case "ArrowRight":
          case "ArrowUp":
            newValue = Math.min(this._value + 1, this._max);
            break;
          case "ArrowLeft":
          case "ArrowDown":
            newValue = Math.max(this._value - 1, this._min);
            break;
        }
        this.value = newValue;
      }
    });
  }

  _setTrackColor() {
    const range = this.shadowRoot.querySelector('input[type="range"]');
    if (!range) return;
    const percent = ((Number(this._value) - Number(this._min)) / (Number(this._max) - Number(this._min))) * 100;
    range.style.setProperty("--percent", percent + "%");
  }

  _update() {
    if (!this.shadowRoot) return;
    const range = this.shadowRoot.querySelector('input[type="range"]');
    const valueInput = this.shadowRoot.querySelector(".value-input");
    if (range) {
      range.value = this._value;
      range.min = this._min;
      range.max = this._max;
      range.setAttribute('aria-valuenow', this._value);
      range.setAttribute('aria-valuemin', this._min);
      range.setAttribute('aria-valuemax', this._max);
      this._setTrackColor();
    }
    if (valueInput) {
      valueInput.value = this._value;
      valueInput.min = this._min;
      valueInput.max = this._max;
      valueInput.setAttribute('aria-valuenow', this._value);
      valueInput.setAttribute('aria-valuemin', this._min);
      valueInput.setAttribute('aria-valuemax', this._max);
    }
    const label = this.shadowRoot.querySelector(".label");
    if (label) label.textContent = this._label;
  }

  _dispatchValueChanged() {
    this.dispatchEvent(
      new CustomEvent("value-changed", { detail: this._value })
    );
  }
}

customElements.define("character-slider", CharacterSlider);
// Attribution: d3bvstack, 2025.
