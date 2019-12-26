import {css, customElement, html, LitElement, property} from 'lit-element';
import {BehaviorSubject, combineLatest, NEVER, Observable, Subject, timer} from 'rxjs';
import {distinctUntilChanged, pluck, scan, shareReplay, switchMap, takeUntil} from 'rxjs/operators';

import '@material/mwc-button';
import '@material/mwc-textfield';

import './ticker';

interface IMetronomeState {
  beatsPerBar: number;
  beatsPerMinute: number;
  counter: number;
  isTicking: boolean;
}

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
  public metronomeStateCommandBus$: BehaviorSubject<Partial<IMetronomeState>> = new BehaviorSubject(
    this.initMetronomeState,
  );
  public metronomeState$: Observable<IMetronomeState> = this.metronomeStateCommandBus$.pipe(
    scan((metronomeState: IMetronomeState, command) => ({...metronomeState, ...command})),
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

  public connectedCallback() {
    super.connectedCallback();

    this.subscribeProps();
  }

  public disconnectedCallback() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    super.disconnectedCallback();
  }

  public onStartCLick() {
    this.dispatchCommand({isTicking: true});
  }

  public onStopCLick() {
    this.dispatchCommand({isTicking: false});
  }

  public onResetClick() {
    this.dispatchCommand(this.initMetronomeState);
  }

  public onBeatsPerMinuteChange({target: {value}}) {
    this.dispatchCommand({beatsPerMinute: Number(value)});
  }

  public onBeatsPerBarChange({target: {value}}) {
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

      .config-inputs {
        padding: 16px 0;
      }

      .buttons {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        width: 100%;
      }

      mwc-button {
        --mdc-theme-primary: var(--primary-color);
        --mdc-theme-on-primary: var(--text-color);
      }

      mwc-textfield {
        --mdc-theme-primary: var(--primary-color);
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
          label="Beats per minute"
          .value="${this.beatsPerMinute.toString()}"
          @change="${this.onBeatsPerMinuteChange}"
        ></mwc-textfield>
        </mwc-slider>
        <mwc-textfield
          type="number"
          min="2"
          max="6"
          label="Beats per bar"
          .value="${this.beatsPerBar.toString()}"
          @change="${this.onBeatsPerBarChange}"
        ></mwc-textfield>
      </div>
      <div class="buttons">
        <mwc-button
          outlined
          label="start"
          icon="play_arrow"
          ?disabled="${this.isTicking}"
          @click="${this.onStartCLick}"
        ></mwc-button>
        <mwc-button
          outlined
          label="stop"
          icon="stop"
          ?disabled="${!this.isTicking}"
          @click="${this.onStopCLick}"
        ></mwc-button>
        <mwc-button outlined label="Reset" icon="clear" @click="${this.onResetClick}"></mwc-button>
      </div>
    `;
  }

  private dispatchCommand(value) {
    this.metronomeStateCommandBus$.next(value);
  }

  private subscribeProps() {
    this.isTicking$.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => (this.isTicking = value));
    this.beatsPerMinute$.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => (this.beatsPerMinute = value));
    this.beatsPerBar$.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => (this.beatsPerBar = value));
    this.counter$.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => (this.counter = value));

    this.counterUpdateTrigger$.pipe(takeUntil(this.unsubscribe$)).subscribe(() =>
      this.metronomeStateCommandBus$.next({
        counter: this.counter < this.beatsPerBar ? this.counter + 1 : 1,
      }),
    );
  }
}
