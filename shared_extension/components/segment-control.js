// Custom element for segment control
import getSharedStyles from './styles-loader.js';

class SegmentControl extends HTMLElement {
  #options = [];
  #selectedOption = "";
  #uniqueId = Math.random().toString(36).substring(2, 10);

  static get observedAttributes() {
    return ["selected"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  get selectedOption() {
    return this.#selectedOption;
  }
  set selectedOption(val) {
    if (this.#selectedOption !== val) {
      this.#selectedOption = val;
      this.setAttribute("selected", val);
      this.#updateSelectedOption();
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "selected" && oldValue !== newValue) {
      this.#selectedOption = newValue;
      this.#updateSelectedOption();
    }
  }

  connectedCallback() {
    this.#render();
    this.#setupEventListeners();
    requestAnimationFrame(() => this.#updateSelectedOption());
  }

  #render() {
    this.#options = Array.from(this.children)
      .filter((child) => child.hasAttribute("data-option"))
      .map((child) => ({
        value: child.getAttribute("data-option"),
        label: child.textContent.trim(),
      }));
    if (!this.#selectedOption && this.#options.length > 0) {
      this.#selectedOption = this.#options[0].value;
    }
    const groupId = `segment-control-${this.#uniqueId}`;
    this.shadowRoot.innerHTML = `      <style>
        ${getSharedStyles()}
        :host { 
          display: block; 
          width: 100%; 
          box-sizing: var(--box-sizing, border-box);
          max-width: 100%;
          overflow: hidden;
        }
        .segmented-control-item {
          align-self: stretch;
          height: 3.25rem;
          padding: 0.25rem;
          background: var(--color-secondary);
          border-radius: var(--border-radius);
          display: flex;
          width: 100%;
          max-width: 100%;
          box-sizing: var(--box-sizing, border-box);
          position: relative;
        }
        .segment-option {
          flex: 1 1 0;
          padding: 0.5rem;
          text-align: center;
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-family-base, 'Roboto', sans-serif);
          font-size: 14px;
          transition: all var(--transition, 0.2s);
          color: var(--color-primary-light);
          font-weight: 400;
          line-height: 1.1rem;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          border-radius: var(--border-radius);
          position: relative;
          z-index: 2;
        }
        .segment-option.active {
          color: white;
          font-weight: 500;
          line-height: 16.72px;
          overflow: hidden;
        }
        .segment-option:focus { outline: none; box-shadow: none; }
        .segment-option:focus-visible {
          outline: 3px solid var(--color-primary);
          outline-offset: 2px;
          z-index: 3;
        }
        .slider-background {
          position: absolute;
          height: calc(100% - 0.5rem);
          z-index: 1;
          background: linear-gradient(202deg, var(--color-primary-light) 0%, var(--color-primary-dark) 100%);
          border-radius: var(--border-radius);
          transition: all var(--transition, 0.2s);
        }
      </style>
      <div class="segmented-control-item" role="radiogroup" id="${groupId}" aria-label="Options selection">
        <div class="slider-background"></div>
        ${this.#options
          .map(
            (option, index) => `
          <button class="segment-option${option.value === this.#selectedOption ? " active" : ""}"
                  data-option="${option.value}"
                  role="radio"
                  aria-checked="${option.value === this.#selectedOption}"
                  id="${groupId}-option-${index}"
                  tabindex="${option.value === this.#selectedOption ? "0" : "-1"}">
            ${option.label}
          </button>
        `
          )
          .join("")}
      </div>
      <slot name="content"></slot>
    `;
  }

  #setupEventListeners() {
    const segmentOptions = this.shadowRoot.querySelectorAll(".segment-option");
    segmentOptions.forEach((option) => {
      option.addEventListener("click", () => this.#selectOption(option));
      option.addEventListener("keydown", (e) => this.#handleKeydown(e, option, segmentOptions));
    });
  }

  #handleKeydown(e, option, segmentOptions) {
    const currentIndex = Array.from(segmentOptions).indexOf(option);
    const lastIndex = segmentOptions.length - 1;
    switch (e.key) {
      case " ":
      case "Enter":
        e.preventDefault();
        this.#selectOption(option);
        break;
      case "ArrowRight":
      case "ArrowDown": {
        e.preventDefault();
        const nextIndex = currentIndex < lastIndex ? currentIndex + 1 : 0;
        this.#selectOption(segmentOptions[nextIndex]);
        segmentOptions[nextIndex].focus();
        break;
      }
      case "ArrowLeft":
      case "ArrowUp": {
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : lastIndex;
        this.#selectOption(segmentOptions[prevIndex]);
        segmentOptions[prevIndex].focus();
        break;
      }
      case "Home":
        e.preventDefault();
        this.#selectOption(segmentOptions[0]);
        segmentOptions[0].focus();
        break;
      case "End":
        e.preventDefault();
        this.#selectOption(segmentOptions[lastIndex]);
        segmentOptions[lastIndex].focus();
        break;
      case "Tab":
        break;
    }
  }

  #selectOption(option) {
    const optionValue = option.getAttribute("data-option");
    if (optionValue === this.#selectedOption) return;
    this.selectedOption = optionValue;
    this.#updateSliderPosition(option);
    this.dispatchEvent(
      new CustomEvent("segment-changed", {
        detail: { value: optionValue },
        bubbles: true,
      })
    );
  }

  #updateSelectedOption() {
    const segmentOptions = this.shadowRoot.querySelectorAll(".segment-option");
    const sliderBackground = this.shadowRoot.querySelector(".slider-background");
    segmentOptions.forEach((option) => {
      const isSelected = option.getAttribute("data-option") === this.#selectedOption;
      option.classList.toggle("active", isSelected);
      option.setAttribute("aria-checked", isSelected);
      option.setAttribute("tabindex", isSelected ? "0" : "-1");
    });
    const activeOption = this.shadowRoot.querySelector(".segment-option.active");
    if (activeOption && sliderBackground) {
      sliderBackground.style.width = `${activeOption.offsetWidth}px`;
      sliderBackground.style.left = `${activeOption.offsetLeft}px`;
      sliderBackground.style.transform = "";
    }
    this.dispatchEvent(
      new CustomEvent("segment-updated", {
        detail: { selected: this.#selectedOption },
        bubbles: true,
        composed: true,
      })
    );
  }

  #updateSliderPosition(option) {
    const sliderBackground = this.shadowRoot.querySelector(".slider-background");
    if (sliderBackground) {
      sliderBackground.style.width = `${option.offsetWidth}px`;
      sliderBackground.style.left = `${option.offsetLeft}px`;
    }
  }
}

customElements.define("segment-control", SegmentControl);
// Attribution: d3bvstack, 2025.
