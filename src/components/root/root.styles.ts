import { css } from 'lit';

export const styles = css`
  :host {
    --primary-color: #302ae6;
    --secondary-color: #536390;
    --text-color: #424242;
    --app-bg-color: #fafafa;
    --bg-color: #ffffff;
    --header-bg: var(--primary-color);
    --header-text-color: #ffffff;

    display: block;
    background-color: var(--app-bg-color);
    color: var(--text-color);
    height: 100vh;
    width: 100%;
  }

  :host([dark-theme]) {
    --primary-color: #9a97f3;
    --secondary-color: #818cab;
    --text-color: #e1e1ff;
    --app-bg-color: #121212;
    --bg-color: #2d2d2d;
    --heading-color: #818cab;
    --header-bg: var(--bg-color);
    --header-text-color: var(--primary-color);
  }

  mwc-top-app-bar {
    --mdc-theme-primary: var(--header-bg);
    --mdc-theme-on-primary: var(--header-text-color);
  }

  .card {
    display: flex;
    border-radius: 4px;
    background: var(--bg-color);
    box-shadow:
      0px 2px 1px -1px rgba(0, 0, 0, 0.2),
      0px 1px 1px 0px rgba(0, 0, 0, 0.14),
      0px 1px 3px 0px rgba(0, 0, 0, 0.12);
    max-width: 480px;
    margin: 16px auto;
    padding: 16px 12px;
  }

  .version {
    text-align: center;
  }

  a {
    color: var(--text-color);
    text-decoration: none;
  }

  a:hover {
    color: var(--primary-color);
  }
`;
