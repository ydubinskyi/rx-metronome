import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { TEMPO_TERMS } from '../../constants';

@customElement('rx-tempo-text')
export class RxTempoTextElement extends LitElement {
  @property({ type: Number })
  public beatsPerMinute: number;

  public get bmpText(): string {
    const bpm = this.beatsPerMinute;

    return TEMPO_TERMS.filter((term) => bpm >= term.from && bpm <= term.to)
      .map((term) => term.name)
      .join(', ');
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        width: 100%;
      }

      .number-value {
        font-size: 36px;
        line-height: 1;
        margin: 0 0 8px;
      }

      .text-value {
        font-size: 18px;
        line-height: 1;
        margin: 0;
      }
    `;
  }

  protected render() {
    return html`
      <p class="number-value">${this.beatsPerMinute} bpm</p>
      <p class="text-value">${this.bmpText}</p>
    `;
  }
}
