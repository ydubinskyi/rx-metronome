import {css, customElement, html, LitElement, property} from 'lit-element';

import '@material/mwc-icon-button';
import '@material/mwc-top-app-bar';

import {version} from '../package.json';
import './lib/rx-metronome.element';

@customElement('my-app')
class MyAppElement extends LitElement {
  @property({type: Boolean, reflect: true, attribute: 'dark-theme'})
  public darkTheme = true;

  public toggleDarkMode(): void {
    this.darkTheme = !this.darkTheme;

    this.changeThemeColor(this.darkTheme ? '#9a97f3' : '#302ae6');
    localStorage.setItem('theme', this.darkTheme ? 'dark' : 'bright');
  }

  public firstUpdated() {
    const savedTheme = localStorage.getItem('theme') || 'dark';

    this.darkTheme = savedTheme === 'dark';
  }

  static get styles() {
    return css`
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
        box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14),
          0px 1px 3px 0px rgba(0, 0, 0, 0.12);
        max-width: 480px;
        margin: 16px auto;
        padding: 16px 12px;
      }

      .version {
        text-align: center;
      }
    `;
  }

  protected render() {
    return html`
      <mwc-top-app-bar dense>
        <div slot="title">rx-metronome</div>
        <mwc-icon-button
          icon="${this.darkTheme ? 'brightness_7' : 'brightness_4'}"
          slot="actionItems"
          @click="${this.toggleDarkMode}"
          title="${this.darkTheme ? 'Switch to bright mode' : 'Switch to dark mode'}"
        ></mwc-icon-button>
      </mwc-top-app-bar>
      <div class="card">
        <rx-metronome></rx-metronome>
      </div>
      <div class="version">
        ver. ${version}
      </div>
    `;
  }

  private changeThemeColor(color: string) {
    const metaThemeColor = document.querySelector('meta[name=theme-color]');
    metaThemeColor.setAttribute('content', color);
  }
}
