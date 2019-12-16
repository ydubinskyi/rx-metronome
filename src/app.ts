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
        --font-color: #424242;
        --bg-color: #fafafa;
        --heading-color: #292922;

        background-color: var(--bg-color);
        display: flex;
        height: 100vh;
        width: 100%;
      }

      :host([dark-theme]) {
        --primary-color: #9a97f3;
        --secondary-color: #818cab;
        --font-color: #e1e1ff;
        --bg-color: #161625;
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
