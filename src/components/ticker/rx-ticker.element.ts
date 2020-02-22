import {css, customElement, html, LitElement, property} from 'lit-element';

@customElement('rx-ticker')
export class RxTickerElement extends LitElement {
  @property({type: Number})
  public beatsPerBar: number;

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
        margin: 0 4px;
        padding: 8px 16px;
        border-radius: 0;
        border: 2px solid var(--primary-color);
        text-align: center;
        font-size: 24px;
      }

      div:first-of-type {
        border-radius: 4px 0 0 4px;
      }

      div:last-of-type {
        border-radius: 0 4px 4px 0;
      }

      div[active] {
        color: #ffffff;
        background-color: var(--primary-color);
      }
    `;
  }

  protected render() {
    return html`
      ${this.items.map(
        (i) => html`
          <div ?active="${i + 1 === this.counter}">${i + 1}</div>
        `,
      )}
    `;
  }
}
