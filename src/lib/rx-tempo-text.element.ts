import {css, customElement, html, LitElement, property} from 'lit-element';

const terms = [
  {
    from: 0,
    to: 20,
    name: 'Larghissimo',
  },
  {
    from: 20,
    to: 45,
    name: 'Grave',
  },
  {
    from: 40,
    to: 60,
    name: 'Largo',
  },
  {
    from: 45,
    to: 60,
    name: 'Lento',
  },
  {
    from: 60,
    to: 66,
    name: 'Larghetto',
  },
  {
    from: 66,
    to: 76,
    name: 'Adagio',
  },
  {
    from: 70,
    to: 80,
    name: 'Adagietto',
  },
  {
    from: 76,
    to: 108,
    name: 'Andante',
  },
  {
    from: 80,
    to: 108,
    name: 'Andantino',
  },
  {
    from: 83,
    to: 88,
    name: 'Marcia moderato',
  },
  {
    from: 92,
    to: 112,
    name: 'Andante moderato',
  },
  {
    from: 108,
    to: 120,
    name: 'Moderato',
  },
  {
    from: 116,
    to: 120,
    name: 'Allegro moderato',
  },
  {
    from: 120,
    to: 156,
    name: 'Allegro',
  },
  {
    from: 156,
    to: 176,
    name: 'Vivace',
  },
  {
    from: 172,
    to: 176,
    name: 'Vivacissimo',
  },
  {
    from: 168,
    to: 200,
    name: 'Presto',
  },
  {
    from: 200,
    to: 300,
    name: 'Prestissimo',
  },
];

@customElement('rx-tempo-text')
class RxTempoTextElement extends LitElement {
  @property({type: Number})
  public beatsPerMinute: number;

  public get bmpText(): string {
    const bpm = this.beatsPerMinute;

    return terms
      .filter((term) => bpm >= term.from && bpm <= term.to)
      .map((term) => term.name)
      .join(', ');
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        padding-bottom: 16px;
      }

      .number-value {
        font-size: 36px;
        line-height: 1;
        margin: 0 0 8px;
      }

      .text-value {
        font-size: 24px;
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
