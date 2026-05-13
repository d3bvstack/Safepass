// Utility to load shared styles for components
const getSharedStyles = () => {
  // Inlined CSS from shared-styles.css - this avoids @import which doesn't work in Shadow DOM
  return `
  /* shared-styles.css: Centralized styles for all components */

  :host {
    font-family: var(--font-family-base, 'Roboto', sans-serif);
  }
  
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
    transition: background var(--transition, 0.2s) ease;
  }
  
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
    max-width: 100%;
    box-sizing: var(--box-sizing, border-box);
  }
  
  .label {
    font-size: var(--font-size-sm, 0.9rem);
    color: #555;
    text-align: left;
    transition: var(--transition, 0.2s);
    position: relative;
    cursor: pointer;
  }
  
  .input-field {
    flex: 1;
    height: 100%;
    padding: 0.5rem 1rem;
    border: none;
    background: transparent;
    font-family: var(--font-family-base, 'Roboto', sans-serif);
    font-size: var(--font-size-base, 1rem);
    color: var(--color-text, #333);
  }
  
  .input-field:focus {
    outline: none;
  }
  
  .badge {
    padding: 4px 8px;
    border-radius: var(--border-radius, 4px);
    font-size: 0.75rem;
    font-weight: 500;
    text-align: center;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  
  .badge-success {
    background-color: var(--color-success, #29D243);
    color: white;
  }
  
  .badge-warning {
    background-color: var(--color-warning, #FFCACA);
    color: var(--color-danger, #FF4141);
  }
  
  .badge-info {
    background-color: var(--color-secondary, #EFF5FF);
    color: var(--color-primary, #3064C7);
  }
  
  .checkbox-container {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }
  
  .custom-checkbox {
    width: 20px;
    height: 20px;
    border: 1.5px solid #D4E3FF;
    border-radius: var(--border-radius, 4px);
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all var(--transition, 0.2s) ease;
  }
  
  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  
  .native-checkbox {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    width: 100%;
    padding: 10px 0;
  }
  
  .strength-bar {
    position: relative;
    width: 100%;
    height: 4px;
    background-color: #e0e0e0;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 8px;
  }
  
  .divider {
    width: 100%;
    height: 1px;
    background-color: var(--color-divider, hsla(217, 73%, 51%, 0.1));
    margin: 1.5rem 0rem 0.75rem;
  }
  `;
};

export default getSharedStyles;
// Attribution: d3bvstack, 2025.
