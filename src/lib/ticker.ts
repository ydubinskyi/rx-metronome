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
        display: flex;
        justify-content: space-evenly;
        width: 100%;
      }

      div {
        flex: 1;
        margin-right: 8px;
        padding: 8px;
        border-radius: 4px;
        border: 2px solid var(--primary-color);
        text-align: center;
      }

      div:last-of-type {
        margin-right: 0;
      }

      div[active] {
        color: #ffffff;
        background-color: var(--primary-color);
      }
    `;
  }

  public render() {
    return html`
      ${this.items.map(
        (i) => html`
          <div ?active="${i + 1 === this.counter}">${i + 1}</div>
        `,
      )}
    `;
  }
}
