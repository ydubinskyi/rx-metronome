import {css, customElement, html, LitElement, property} from 'lit-element';
import {BehaviorSubject, combineLatest, NEVER, timer} from 'rxjs';
import {distinctUntilChanged, pluck, scan, shareReplay, startWith, switchMap} from 'rxjs/operators';

import './ticker';

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
  public initMetronomeState = {
    beatsPerBar: 4,
    beatsPerMinute: 72,
    counter: 1,
    isTicking: false,
  };
  public metronomeStateCommandBus$: BehaviorSubject<any> = new BehaviorSubject({});
  public metronomeState$ = this.metronomeStateCommandBus$.pipe(
    startWith(this.initMetronomeState),
    scan((metronomeState, command) => ({...metronomeState, ...command})),
    shareReplay(1),
  );

  public isTicking$ = this.metronomeState$.pipe(pluck('isTicking'), distinctUntilChanged<boolean>());
  public beatsPerMinute$ = this.metronomeState$.pipe(pluck('beatsPerMinute'), distinctUntilChanged<number>());
  public beatsPerBar$ = this.metronomeState$.pipe(pluck('beatsPerBar'), distinctUntilChanged<number>());
  public counter$ = this.metronomeState$.pipe(pluck('counter'), distinctUntilChanged<number>());

  public counterUpdateTrigger$ = combineLatest([this.isTicking$, this.beatsPerMinute$]).pipe(
    switchMap(([isTicking, beatsPerMinute]) => (isTicking ? timer(0, 1000 * (60 / beatsPerMinute)) : NEVER)),
  );

  public connectedCallback() {
    super.connectedCallback();

    this.subscribeProps();

    this.counterUpdateTrigger$.subscribe(() =>
      this.metronomeStateCommandBus$.next({
        counter: this.counter < this.beatsPerBar ? this.counter + 1 : 1,
      }),
    );
  }

  public subscribeProps() {
    this.isTicking$.subscribe((value) => (this.isTicking = value));
    this.beatsPerMinute$.subscribe((value) => (this.beatsPerMinute = value));
    this.beatsPerBar$.subscribe((value) => (this.beatsPerBar = value));
    this.counter$.subscribe((value) => (this.counter = value));
  }

  public onStartCLick() {
    this.metronomeStateCommandBus$.next({isTicking: true});
  }

  public onStopCLick() {
    this.metronomeStateCommandBus$.next({isTicking: false});
  }

  public onResetClick() {
    this.metronomeStateCommandBus$.next(this.initMetronomeState);
  }

  public onBeatsPerMinuteChange({target: {value}}) {
    this.metronomeStateCommandBus$.next({beatsPerMinute: Number(value)});
  }

  public onBeatsPerBarChange({target: {value}}) {
    this.metronomeStateCommandBus$.next({beatsPerBar: Number(value)});
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        align-content: center;
        align-items: center;
        width: 100%;
        max-width: 480px;
        margin: 24px auto;
        border-radius: 4px;
        background: #fff;
        box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14),
          0px 1px 3px 0px rgba(0, 0, 0, 0.12);
      }

      .buttons {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        padding: 16px 0;
        width: 100%;
      }

      .buttons button {
        display: block;
        padding: 8px 16px;
        border: 0;
        font-size: 14px;
      }
    `;
  }

  public render() {
    return html`
      <h2>Metronome</h2>
      <rx-ticker .beatsPerBar="${this.beatsPerBar}" .counter="${this.counter}"></rx-ticker>
      <div class="config-inputs">
        <input .value="${this.beatsPerMinute.toString()}" @change="${this.onBeatsPerMinuteChange}" />
        <input .value="${this.beatsPerBar.toString()}" @change="${this.onBeatsPerBarChange}" />
      </div>
      <div class="buttons">
        <button ?disabled="${this.isTicking}" @click="${this.onStartCLick}">
          Start
        </button>
        <button ?disabled="${!this.isTicking}" @click="${this.onStopCLick}">
          Stop
        </button>
        <button @click="${this.onResetClick}">
          Reset
        </button>
      </div>
    `;
  }
}
