// Custom element for advanced options dropdown component
import getSharedStyles from './styles-loader.js';

class AdvancedOptions extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isOpen = false;
  }

  static get observedAttributes() {
    return ["title"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "title" && oldValue !== newValue) {
      this._updateTitle(newValue);
    }
  }

  connectedCallback() {
    this._render();
    this._setupEventListeners();
  }

  // --- Private Methods ---

  _render() {
    const title = this.getAttribute("title") || "Advanced Options";
    this.shadowRoot.innerHTML = `      <style>
        ${getSharedStyles()}
        :host {
          display: block;
          width: 100%;
          max-width: 100%;
          box-sizing: var(--box-sizing, border-box);
          overflow: hidden;
        }
        .advanced-options-container {
          width: 100%;
          max-width: 100%;
          box-sizing: var(--box-sizing, border-box);
        }
        .advanced-options-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0rem 1rem;
          background: var(--color-secondary, #EFF5FF);
          border-radius: var(--border-radius, 4px);
          cursor: pointer;
          user-select: none;
          height: 3.375rem;
          transition: background-color var(--transition, 0.2s), color var(--transition, 0.2s);
          width: 100%;
          max-width: 100%;
          box-sizing: var(--box-sizing, border-box);
        }
        .advanced-options-header:hover:not(.open) {
          background-color: #E6EEFF;
        }
        .advanced-options-header:hover:not(.open) .advanced-options-title {
          color: #1F4CA5;
        }
        .advanced-options-header:hover:not(.open) .arrow-icon path {
          fill: #1F4CA5;
        }
        .advanced-options-header:focus {
          outline: none;
        }
        .advanced-options-header:focus-visible {
          outline: 3px solid var(--color-primary, #3064C7);
          outline-offset: 2px;
        }
        .advanced-options-header.open {
          background: #3267cb;
        }
        .advanced-options-title {
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--color-primary, #3064C7);
          transition: color var(--transition, 0.2s);
        }
        .advanced-options-title.open {
          color: white;
        }
        .advanced-options-icon {
          width: 24px;
          height: 24px;
          transition: transform var(--transition, 0.2s);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .advanced-options-icon.open {
          transform: rotate(180deg);
        }
        .advanced-options-icon svg {
          width: 24px;
          height: 24px;
        }
        .advanced-options-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s, padding var(--transition, 0.2s), opacity var(--transition, 0.2s), border-width var(--transition, 0.2s);
          background: rgb(245, 248, 252);
          border-radius: var(--border-radius, 4px);
          opacity: 0;
          padding: 0 0;
          margin-top: 0;
          width: 100%;
          max-width: 100%;
          box-sizing: var(--box-sizing, border-box);
        }
        .advanced-options-content.open {
          max-height: 500px;
          opacity: 1;
          padding: 0 0;
          border-width: 1px;
          border-top: none;
          margin-top: 0.25rem;
          width: 100%;
          max-width: 100%;
          box-sizing: var(--box-sizing, border-box);
        }
        .slot-container {
          display: block;
          width: 100%;
          max-width: 100%;
          box-sizing: var(--box-sizing, border-box);
        }
        :host ::slotted(*) label,
        :host ::slotted(styled-checkbox) .checkbox-label,
        :host ::slotted(*) .label {
          font-family: var(--font-family-base, 'Roboto', sans-serif) !important;
          font-size: var(--font-size-base, 1rem) !important;
        }
      </style>
      <div class="advanced-options-container">
        <div class="advanced-options-header" id="header" role="button" aria-expanded="${this.isOpen}" aria-controls="advanced-options-content" tabindex="0">
          <span class="advanced-options-title" id="advanced-options-title">${title}</span>
          <span class="advanced-options-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="arrow-icon">
              <path d="M8 10.5L3 5.5L4 4.5L8 8.5L12 4.5L13 5.5L8 10.5Z" fill="var(--color-primary, #3064C7)"/>
            </svg>
          </span>
        </div>
        <div class="advanced-options-content" id="advanced-options-content" role="region" aria-labelledby="advanced-options-title" tabindex="${this.isOpen ? '0' : '-1'}">
          <div class="slot-container">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }

  _setupEventListeners() {
    const header = this.shadowRoot.getElementById("header");
    const content = this.shadowRoot.querySelector(".advanced-options-content");
    const icon = this.shadowRoot.querySelector(".advanced-options-icon");
    const title = this.shadowRoot.querySelector(".advanced-options-title");
    const arrowPath = this.shadowRoot.querySelector(".arrow-icon path");

    const toggleDropdown = () => {
      this.isOpen = !this.isOpen;
      header.setAttribute("aria-expanded", this.isOpen);
      content.classList.toggle("open", this.isOpen);
      icon.classList.toggle("open", this.isOpen);
      header.classList.toggle("open", this.isOpen);
      title.classList.toggle("open", this.isOpen);
      arrowPath.setAttribute("fill", this.isOpen ? "white" : "#3064C7");
      content.setAttribute("tabindex", this.isOpen ? "0" : "-1");
      this._updateChildFocusability(this.isOpen);
      this.dispatchEvent(new CustomEvent("toggle", { bubbles: true, detail: { isOpen: this.isOpen } }));
    };

    header.addEventListener("click", toggleDropdown);
    header.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        toggleDropdown();
      }
    });
  }

  _updateChildFocusability(focusable) {
    const slot = this.shadowRoot.querySelector("slot");
    slot.assignedElements().forEach(el => this._setElementFocusable(el, focusable));
  }

  _setElementFocusable(element, focusable) {
    const focusableElements = element.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusableElements.forEach(el => {
      if (focusable) {
        if (el.dataset.originalTabindex) {
          el.setAttribute('tabindex', el.dataset.originalTabindex);
          delete el.dataset.originalTabindex;
        }
      } else {
        if (el.hasAttribute('tabindex')) {
          el.dataset.originalTabindex = el.getAttribute('tabindex');
        } else {
          el.dataset.originalTabindex = '0';
        }
        el.setAttribute('tabindex', '-1');
      }
    });
    if (element.hasAttribute('tabindex') && element.getAttribute('tabindex') !== '-1') {
      if (focusable) {
        if (element.dataset.originalTabindex) {
          element.setAttribute('tabindex', element.dataset.originalTabindex);
          delete element.dataset.originalTabindex;
        }
      } else {
        element.dataset.originalTabindex = element.getAttribute('tabindex');
        element.setAttribute('tabindex', '-1');
      }
    }
  }

  _updateTitle(title) {
    const titleElement = this.shadowRoot.querySelector(".advanced-options-title");
    if (titleElement) titleElement.textContent = title;
  }

  // --- Public Methods ---

  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this._setOpenState(true);
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this._setOpenState(false);
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  _setOpenState(isOpen) {
    const content = this.shadowRoot.querySelector(".advanced-options-content");
    const icon = this.shadowRoot.querySelector(".advanced-options-icon");
    const header = this.shadowRoot.getElementById("header");
    const title = this.shadowRoot.querySelector(".advanced-options-title");
    const arrowPath = this.shadowRoot.querySelector(".arrow-icon path");
    header.setAttribute("aria-expanded", isOpen);
    content.classList.toggle("open", isOpen);
    icon.classList.toggle("open", isOpen);
    header.classList.toggle("open", isOpen);
    title.classList.toggle("open", isOpen);
    arrowPath.setAttribute("fill", isOpen ? "white" : "#3064C7");
    content.setAttribute("tabindex", isOpen ? "0" : "-1");
    this._updateChildFocusability(isOpen);
    this.dispatchEvent(new CustomEvent("toggle", { bubbles: true, detail: { isOpen } }));
  }
}

customElements.define("advanced-options", AdvancedOptions);
// Copyright (c) 2025 d3bvstack. All rights reserved.
// This file is part of the Safepass project and may not be copied or distributed without permission.
