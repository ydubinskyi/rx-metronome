import {css, customElement, html, LitElement, property} from 'lit-element';

import './lib/rx-metronome';

@customElement('my-app')
class MyAppElement extends LitElement {
  @property({type: Boolean, reflect: true, attribute: 'dark-theme'})
  public darkTheme = true;

  static get styles() {
    return css`
      :host {
        --primary-color: #302ae6;
        --secondary-color: #536390;
        --text-color: #424242;
        --app-bg-color: #fafafa;
        --bg-color: #ffffff;
        --heading-color: #292922;

        background-color: var(--app-bg-color);
        color: var(--text-color);
        display: flex;
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
      }
    `;
  }

  public render() {
    return html`
      <rx-metronome></rx-metronome>
    `;
  }
}
