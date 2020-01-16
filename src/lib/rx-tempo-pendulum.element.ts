import {css, customElement, html, LitElement, property, PropertyValues} from 'lit-element';
import {styleMap} from 'lit-html/directives/style-map';

@customElement('rx-tempo-pendulum')
class RxTempoTextElement extends LitElement {
  @property({type: Number})
  public counter: number;

  @property({type: Number})
  public beatsPerMinute: number;

  @property({attribute: false})
  public tick: boolean = false;

  public updated(changedProperties: PropertyValues) {
    if (changedProperties.has('counter')) {
      this.tick = this.counter === 0 ? false : !this.tick;
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
        width: auto;
        overflow: hidden;

        padding: 4px;
        border-radius: 16px;
        background-color: rgba(12, 12, 12, 0.12);
      }

      .wrapper {
        position: relative;
        width: calc(100% - 16px);

        transform: translateX(0);
        will-change: transform;
        transition-property: transform;
        transition-timing-function: 'linear';
        transition-duration: 0ms;
      }

      .wrapper[animated] {
        transform: translateX(100%);
      }

      .ball {
        display: block;
        height: 16px;
        width: 16px;
        border-radius: 100%;
        background-color: var(--primary-color);
      }
    `;
  }

  protected render() {
    return html`
      <div
        class="wrapper"
        ?animated="${this.tick}"
        style=${styleMap({
          'transition-duration': 1000 * (60 / this.beatsPerMinute) + 'ms',
        })}
      >
        <span class="ball"></span>
      </div>
    `;
  }
}
