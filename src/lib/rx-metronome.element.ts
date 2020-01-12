import {TextField} from '@material/mwc-textfield';
import {css, customElement, eventOptions, html, LitElement, property} from 'lit-element';
import {BehaviorSubject, Subject} from 'rxjs';
import {distinctUntilChanged, pluck, takeUntil} from 'rxjs/operators';

import {Command} from './command.type';
import {initState} from './constants';
import {IMetronomeState} from './metronome-state.interface';

import '@material/mwc-button';
import '@material/mwc-textfield';
import './rx-tempo-text.element';
import './rx-ticker.element';

type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T;
};

@customElement('rx-metronome')
class RxMetronomeElement extends LitElement {
  @property({type: Boolean})
  public isTicking: boolean;

  @property({type: Number})
  public beatsPerMinute: number;

  @property({type: Number})
  public beatsPerBar: number;

  @property({type: Number})
  public counter: number;

  private metronomeState$: BehaviorSubject<IMetronomeState> = new BehaviorSubject(initState);
  private stateWorker: Worker;

  private isTicking$ = this.metronomeState$.pipe(pluck('isTicking'), distinctUntilChanged<boolean>());
  private beatsPerMinute$ = this.metronomeState$.pipe(pluck('beatsPerMinute'), distinctUntilChanged<number>());
  private beatsPerBar$ = this.metronomeState$.pipe(pluck('beatsPerBar'), distinctUntilChanged<number>());
  private counter$ = this.metronomeState$.pipe(pluck('counter'), distinctUntilChanged<number>());

  private audioContext = new AudioContext();
  private unsubscribe$ = new Subject();

  public connectedCallback() {
    super.connectedCallback();

    this.connectToStateWorker();
    this.subscribeProps();
  }

  public disconnectedCallback() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.audioContext.close();
    this.stateWorker.terminate();

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
    this.dispatchCommand(initState);
  }

  @eventOptions({passive: true})
  public onBeatsPerMinuteChange({target: {value}}: HTMLElementEvent<TextField>) {
    let beatsPerMinute = Number(value);

    if (beatsPerMinute === undefined) {
      beatsPerMinute = initState.beatsPerMinute;
    } else if (beatsPerMinute < 10) {
      beatsPerMinute = 10;
    } else if (beatsPerMinute > 220) {
      beatsPerMinute = 220;
    }

    this.dispatchCommand({beatsPerMinute});
  }

  @eventOptions({passive: true})
  public onBeatsPerBarChange({target: {value}}: HTMLElementEvent<TextField>) {
    this.dispatchCommand({beatsPerBar: Number(value)});
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        align-content: center;
        align-items: center;
        width: 100%;
      }

      .config-inputs,
      .buttons {
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 100%;
      }

      .config-inputs {
        padding: 16px 0;
      }

      .buttons mwc-button,
      .config-inputs mwc-textfield {
        margin: 0 4px;
      }

      mwc-button {
        --mdc-theme-primary: var(--primary-color);
        --mdc-theme-on-primary: var(--text-color);
      }

      mwc-textfield {
        --mdc-theme-primary: var(--primary-color);
        --mdc-text-field-ink-color: var(--text-color);
        --mdc-text-field-outlined-idle-border-color: var(--text-color);
        --mdc-text-field-outlined-hover-border-color: var(--text-color);
        --mdc-text-field-label-ink-color: var(--text-color);

        flex: 1;
      }
    `;
  }

  protected render() {
    return html`
      <rx-tempo-text .beatsPerMinute="${this.beatsPerMinute}"></rx-tempo-text>
      <rx-ticker .beatsPerBar="${this.beatsPerBar}" .counter="${this.counter}"></rx-ticker>
      <div class="config-inputs">
        <mwc-textfield
          type="number"
          outlined
          label="Beats per minute"
          .value="${this.beatsPerMinute.toString()}"
          @change="${this.onBeatsPerMinuteChange}"
        ></mwc-textfield>
        <mwc-textfield
          type="number"
          min="2"
          max="6"
          outlined
          label="Beats per bar"
          .value="${this.beatsPerBar.toString()}"
          @change="${this.onBeatsPerBarChange}"
        ></mwc-textfield>
      </div>
      <div class="buttons">
        ${this.isTicking
          ? html`
              <mwc-button outlined label="stop" icon="stop" @click="${this.onStopClick}"></mwc-button>
            `
          : html`
              <mwc-button outlined label="start" icon="play_arrow" @click="${this.onStartClick}"></mwc-button>
            `}
        <mwc-button outlined label="Reset" icon="clear" @click="${this.onResetClick}"></mwc-button>
      </div>
    `;
  }

  private dispatchCommand(command: Command) {
    this.stateWorker.postMessage(command);
  }

  private connectToStateWorker() {
    this.stateWorker = new Worker('./rx-state.worker.ts', {type: 'module'});
    this.stateWorker.onmessage = (event) => {
      this.metronomeState$.next(event.data);
    };
  }

  private subscribeProps() {
    this.isTicking$.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => (this.isTicking = value));
    this.beatsPerMinute$.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => (this.beatsPerMinute = value));
    this.beatsPerBar$.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => (this.beatsPerBar = value));
    this.counter$.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {
      this.counter = value;

      if (value !== 0) {
        this.playSound(value === 1 ? 880 : 440, 0.07);
      }
    });
  }

  private playSound(frequency: number, length: number) {
    const {currentTime, destination} = this.audioContext;
    const gainNode = this.audioContext.createGain();
    const oscillator = this.audioContext.createOscillator();

    gainNode.connect(destination);
    oscillator.connect(gainNode).connect(destination);

    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(1, currentTime + length * 0.1);
    gainNode.gain.setValueAtTime(1, currentTime + length * 0.3);
    gainNode.gain.linearRampToValueAtTime(0, currentTime + length * 0.9);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, currentTime);
    oscillator.start();
    oscillator.stop(currentTime + length);
  }
}
