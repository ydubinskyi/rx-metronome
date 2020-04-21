import {TextField} from '@material/mwc-textfield';
import {customElement, eventOptions, html, LitElement, property} from 'lit-element';
import {Subject} from 'rxjs';
import {bufferCount, filter, map, takeUntil, timeInterval} from 'rxjs/operators';

import {INIT_STATE, MAX_TEMPO_VALUE, MIN_TEMPO_VALUE, TACK_FREQUENCY, TICK_FREQUENCY} from '../../constants';
import {RxPlaySoundMixin, RxStateMixin, RxUnsubscribeMixin} from '../../mixins';
import {HTMLElementEvent} from '../../types';

import '@material/mwc-button';
import '@material/mwc-icon-button';
import '@material/mwc-list/mwc-list-item.js';
import '@material/mwc-select';
import '@material/mwc-textfield';
import '../tempo-pendulum/rx-tempo-pendulum.element';
import '../tempo-text/rx-tempo-text.element';
import '../ticker/rx-ticker.element';

import {styles} from './rx-metronome.styles';

@customElement('rx-metronome')
export class RxMetronomeElement extends RxPlaySoundMixin(RxStateMixin(RxUnsubscribeMixin(LitElement))) {
  @property({type: Boolean})
  public isTicking: boolean;

  @property({type: Number})
  public beatsPerMinute: number;

  @property({type: Number})
  public beatsPerBar: number;

  @property({type: Number})
  public counter: number;

  private tapTempoSubject$: Subject<void> = new Subject();

  /** @override */
  public connectedCallback() {
    super.connectedCallback();

    this.subscribeProps();
  }

  /** @override */
  public disconnectedCallback() {
    this.stateWorker.terminate();
    this.metronomeState$.complete();
    this.tapTempoSubject$.complete();

    super.disconnectedCallback();
  }

  @eventOptions({passive: true})
  public onStartClick() {
    this.dispatchCommand({isTicking: true});
  }

  @eventOptions({passive: true})
  public onStopClick() {
    this.dispatchCommand({isTicking: false});
  }

  @eventOptions({passive: true})
  public onResetClick() {
    this.dispatchCommand(INIT_STATE);
  }

  @eventOptions({passive: true})
  public onTapTempoClick() {
    this.tapTempoSubject$.next();
  }

  @eventOptions({passive: true})
  public onPlusOneClick() {
    if (this.beatsPerMinute < MAX_TEMPO_VALUE) {
      this.dispatchCommand({beatsPerMinute: this.beatsPerMinute + 1});
    }
  }

  @eventOptions({passive: true})
  public onMinusOneClick() {
    if (this.beatsPerMinute > MIN_TEMPO_VALUE) {
      this.dispatchCommand({beatsPerMinute: this.beatsPerMinute - 1});
    }
  }

  @eventOptions({passive: true})
  public onBeatsPerMinuteChange({target: {value}}: HTMLElementEvent<TextField>) {
    this.dispatchCommand({beatsPerMinute: this.validateBeatsPerMinute(value)});
  }

  @eventOptions({passive: true})
  public onBeatsPerBarChange({target: {value}}: HTMLElementEvent<TextField>) {
    this.dispatchCommand({beatsPerBar: Number(value)});
  }

  public validateBeatsPerMinute(value: string | number): number {
    let beatsPerMinute = Number(value);

    if (beatsPerMinute === undefined) {
      beatsPerMinute = INIT_STATE.beatsPerMinute;
    } else if (beatsPerMinute < MIN_TEMPO_VALUE) {
      beatsPerMinute = MIN_TEMPO_VALUE;
    } else if (beatsPerMinute > MAX_TEMPO_VALUE) {
      beatsPerMinute = MAX_TEMPO_VALUE;
    }

    return beatsPerMinute;
  }

  static get styles() {
    return styles;
  }

  protected render() {
    return html`
      <rx-ticker .beatsPerBar="${this.beatsPerBar}" .counter="${this.counter}"></rx-ticker>
      <rx-tempo-pendulum .counter="${this.counter}" .beatsPerMinute="${this.beatsPerMinute}"></rx-tempo-pendulum>
      <div class="text-and-buttons">
        <mwc-icon-button
          icon="exposure_minus_1"
          ?disabled="${this.beatsPerMinute === MIN_TEMPO_VALUE}"
          @click="${this.onMinusOneClick}"
        ></mwc-icon-button>
        <rx-tempo-text .beatsPerMinute="${this.beatsPerMinute}"></rx-tempo-text>
        <mwc-icon-button
          icon="exposure_plus_1"
          ?disabled="${this.beatsPerMinute === MAX_TEMPO_VALUE}"
          @click="${this.onPlusOneClick}"
        ></mwc-icon-button>
      </div>
      <div class="config-inputs">
        <mwc-textfield
          type="number"
          outlined
          required
          label="Beats per minute"
          min="${MIN_TEMPO_VALUE}"
          max="${MAX_TEMPO_VALUE}"
          .value="${this.beatsPerMinute.toString()}"
          @change="${this.onBeatsPerMinuteChange}"
        ></mwc-textfield>
        <mwc-select
          outlined
          required
          label="Beats per bar"
          @change="${this.onBeatsPerBarChange}"
          .value="${this.beatsPerBar.toString()}"
        >
          <mwc-list-item value="2">2</mwc-list-item>
          <mwc-list-item value="3">3</mwc-list-item>
          <mwc-list-item value="4">4</mwc-list-item>
          <mwc-list-item value="5">5</mwc-list-item>
          <mwc-list-item value="6">6</mwc-list-item>
        </mwc-select>
      </div>
      <div class="control-buttons">
        <mwc-button
          outlined
          class="tap-tempo-btn"
          label="Tap the tempo"
          icon="hourglass_empty"
          @click="${this.onTapTempoClick}"
        ></mwc-button>
        ${this.isTicking
          ? html`
              <mwc-button outlined label="stop" icon="stop" @click="${this.onStopClick}"> </mwc-button>
            `
          : html`
              <mwc-button outlined label="start" icon="play_arrow" @click="${this.onStartClick}"> </mwc-button>
            `}
        <mwc-button outlined label="Reset" icon="clear" @click="${this.onResetClick}"> </mwc-button>
      </div>
    `;
  }

  private subscribeProps() {
    this.isTicking$.pipe(takeUntil(this.unsubscribe$)).subscribe((value: boolean) => (this.isTicking = value));
    this.beatsPerMinute$.pipe(takeUntil(this.unsubscribe$)).subscribe((value: number) => (this.beatsPerMinute = value));
    this.beatsPerBar$.pipe(takeUntil(this.unsubscribe$)).subscribe((value: number) => (this.beatsPerBar = value));
    this.counter$.pipe(takeUntil(this.unsubscribe$)).subscribe((value: number) => {
      this.counter = value;

      if (value !== 0) {
        this.playSound(value === 1 ? TICK_FREQUENCY : TACK_FREQUENCY, 0.07);
      }
    });

    this.tapTempoSubject$
      .pipe(
        timeInterval(),
        filter(({interval}) => interval < 6000),
        bufferCount(3, 2),
        map((values) => {
          const intervals = values.map((value) => value.interval);
          const avrInterval = intervals.reduce((a, b) => a + b) / intervals.length;
          const beatsPerMinute = Math.round((60 * 1000) / avrInterval);

          return this.validateBeatsPerMinute(beatsPerMinute);
        }),
      )
      .subscribe((beatsPerMinute) => this.dispatchCommand({beatsPerMinute}));
  }
}
