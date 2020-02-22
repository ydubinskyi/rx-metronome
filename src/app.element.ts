import {customElement, html, LitElement, property} from 'lit-element';

import '@material/mwc-icon-button';
import '@material/mwc-top-app-bar';

import {version} from '../package.json';
import './components/metronome/rx-metronome.element';

import {styles} from './app.styles';

@customElement('my-app')
export class MyAppElement extends LitElement {
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
    return styles;
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
        Made with ❤ by <a href="https://github.com/ydubinskyi" target="_blank">@ydubinskyi</a> <br />
        ver. ${version}
      </div>
    `;
  }

  private changeThemeColor(color: string) {
    const metaThemeColor = document.querySelector('meta[name=theme-color]');
    metaThemeColor.setAttribute('content', color);
  }
}
