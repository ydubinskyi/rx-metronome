import {css} from 'lit-element';

export const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
    flex: 1;
  }

  .config-inputs,
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
  }

  .config-inputs {
    padding: 16px 0;
  }

  .text-and-buttons {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    min-height: 100px;
  }

  rx-tempo-pendulum {
    margin: 16px 0 0;
    width: calc(100% - 16px);
  }

  .control-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }

  .control-buttons mwc-button,
  .config-inputs mwc-textfield {
    margin-left: 4px;
    margin-right: 4px;
  }

  .tap-tempo-btn {
    width: 100%;
    margin-bottom: 16px;
  }

  mwc-button {
    --mdc-theme-primary: var(--primary-color);
    --mdc-theme-on-primary: var(--text-color);
  }

  mwc-icon-button {
    color: var(--primary-color);
    --mdc-icon-size: 48px;
    --mdc-icon-button-size: 64px;
  }

  mwc-textfield {
    --mdc-theme-primary: var(--primary-color);
    --mdc-text-field-ink-color: var(--text-color);
    --mdc-text-field-outlined-idle-border-color: var(--text-color);
    --mdc-text-field-outlined-hover-border-color: var(--text-color);
    --mdc-text-field-label-ink-color: var(--text-color);

    flex: 1;
  }

  mwc-select {
    --mdc-theme-primary: var(--primary-color);
    --mdc-select-ink-color: var(--text-color);
    --mdc-select-dropdown-icon-color: var(--text-color);
    --mdc-select-label-ink-color: var(--text-color);
    --mdc-select-outlined-idle-border-color: var(--text-color);
    --mdc-select-outlined-hover-border-color: var(--text-color);
    --mdc-theme-surface: var(--bg-color);
    --mdc-theme-text-primary-on-background: var(--text-color);

    flex: 1;
  }
`;
