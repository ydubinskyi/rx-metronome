import {TextField} from '@material/mwc-textfield';
import {css, customElement, eventOptions, html, LitElement, property} from 'lit-element';
import {BehaviorSubject, combineLatest, NEVER, Observable, Subject, timer} from 'rxjs';
import {distinctUntilChanged, pluck, scan, shareReplay, switchMap, takeUntil} from 'rxjs/operators';

import {Command} from './command.type';
import {IMetronomeState} from './metronome-state.interface';

import '@material/mwc-button';
import '@material/mwc-textfield';
import './rx-ticker.element';

import './sounds/bip.mp3';

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

  // State
  public initMetronomeState: IMetronomeState = {
    beatsPerBar: 4,
    beatsPerMinute: 72,
    counter: 1,
    isTicking: false,
  };
  public metronomeStateCommandBus$: BehaviorSubject<Command> = new BehaviorSubject(this.initMetronomeState);
  public metronomeState$: Observable<IMetronomeState> = this.metronomeStateCommandBus$.pipe(
    scan((metronomeState: IMetronomeState, command: Command) => ({...metronomeState, ...command})),
    shareReplay(1),
  );

  public isTicking$ = this.metronomeState$.pipe(pluck('isTicking'), distinctUntilChanged<boolean>());
  public beatsPerMinute$ = this.metronomeState$.pipe(pluck('beatsPerMinute'), distinctUntilChanged<number>());
  public beatsPerBar$ = this.metronomeState$.pipe(pluck('beatsPerBar'), distinctUntilChanged<number>());
  public counter$ = this.metronomeState$.pipe(pluck('counter'), distinctUntilChanged<number>());
  public counterUpdateTrigger$ = combineLatest([this.isTicking$, this.beatsPerMinute$]).pipe(
    switchMap(([isTicking, beatsPerMinute]) => (isTicking ? timer(0, 1000 * (60 / beatsPerMinute)) : NEVER)),
  );

  private unsubscribe$ = new Subject();
  private bipAudioElement: HTMLAudioElement;

  public connectedCallback() {
    super.connectedCallback();

    this.initSounds();
    this.subscribeProps();
  }

  public disconnectedCallback() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

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
    this.dispatchCommand(this.initMetronomeState);
  }

  @eventOptions({passive: true})
  public onBeatsPerMinuteChange({target: {value}}: HTMLElementEvent<TextField>) {
    this.dispatchCommand({beatsPerMinute: Number(value)});
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

  public render() {
    return html`
      <rx-ticker .beatsPerBar="${this.beatsPerBar}" .counter="${this.counter}"></rx-ticker>
      <div class="config-inputs">
        <mwc-textfield
          type="number"
          min="10"
          max="240"
          outlined 
          label="Beats per minute"
          .value="${this.beatsPerMinute.toString()}"
          @change="${this.onBeatsPerMinuteChange}"
        ></mwc-textfield>
        </mwc-slider>
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
      ${
        this.isTicking
          ? html`
              <mwc-button outlined label="stop" icon="stop" @click="${this.onStopClick}"></mwc-button>
            `
          : html`
              <mwc-button outlined label="start" icon="play_arrow" @click="${this.onStartClick}"></mwc-button>
            `
      }
        <mwc-button outlined label="Reset" icon="clear" @click="${this.onResetClick}"></mwc-button>
      </div>
    `;
  }

  private dispatchCommand(command: Command) {
    this.metronomeStateCommandBus$.next(command);
  }

  private subscribeProps() {
    this.isTicking$.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => (this.isTicking = value));
    this.beatsPerMinute$.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => (this.beatsPerMinute = value));
    this.beatsPerBar$.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => (this.beatsPerBar = value));
    this.counter$.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => (this.counter = value));

    this.counterUpdateTrigger$.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {
      this.bipAudioElement.play();
      this.metronomeStateCommandBus$.next({
        counter: this.counter < this.beatsPerBar ? this.counter + 1 : 1,
      });
    });
  }

  private initSounds() {
    this.bipAudioElement = new Audio('sounds/bip.mp3');
    this.bipAudioElement.load();
  }
}
