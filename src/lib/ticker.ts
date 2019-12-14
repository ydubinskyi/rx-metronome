import {css, customElement, html, LitElement, property} from 'lit-element';

@customElement('rx-ticker')
class RxTickerElement extends LitElement {
  @property({type: Number})
  public beatsPerBar: number = 4;

  @property({type: Number})
  public counter: number;

  get items() {
    return Array.from(Array(this.beatsPerBar).keys());
  }

  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
      }

      ul {
        list-style-type: none;
        display: flex;
        width: 100%;
        justify-content: space-evenly;
        margin: 0;
        padding: 16px 0;
      }

      li {
        display: block;
        background-color: green;
        height: 12px;
        width: 12px;
        border-radius: 50%;
      }

      li[active] {
        background-color: red;
      }
    `;
  }

  public render() {
    return html`
      <ul>
        ${this.items.map(
          (i) => html`
            <li ?active="${i + 1 === this.counter}"></li>
          `,
        )}
      </ul>
    `;
  }
}
