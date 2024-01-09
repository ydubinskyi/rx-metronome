import { LitElement } from 'lit';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';

import { INIT_STATE } from '../constants';
import { Command, Constructor, IMetronomeState } from '../types';

export declare class RxStateMixinInterface {
  public metronomeState$: BehaviorSubject<IMetronomeState>;
  public stateWorker: Worker;

  public isTicking$: Observable<boolean>;
  public beatsPerMinute$: Observable<number>;
  public beatsPerBar$: Observable<number>;
  public counter$: Observable<number>;

  public dispatchCommand(command: Command): void;
}

export function RxStateMixin<TBase extends Constructor<LitElement>>(superClass: TBase) {
  class Mixin extends superClass {
    public metronomeState$: BehaviorSubject<IMetronomeState> = new BehaviorSubject(INIT_STATE as IMetronomeState);
    public stateWorker: Worker;

    public isTicking$ = this.metronomeState$.pipe(pluck('isTicking'), distinctUntilChanged<boolean>());
    public beatsPerMinute$ = this.metronomeState$.pipe(pluck('beatsPerMinute'), distinctUntilChanged<number>());
    public beatsPerBar$ = this.metronomeState$.pipe(pluck('beatsPerBar'), distinctUntilChanged<number>());
    public counter$ = this.metronomeState$.pipe(pluck('counter'), distinctUntilChanged<number>());

    /** @override */
    public connectedCallback() {
      super.connectedCallback();

      this.connectToStateWorker();
    }

    public dispatchCommand(command: Command) {
      this.stateWorker.postMessage(command);
    }

    private connectToStateWorker() {
      this.stateWorker = new Worker(new URL('../workers/rx-state.worker.ts', import.meta.url), { type: 'module' });
      this.stateWorker.onmessage = (event) => {
        this.metronomeState$.next(event.data);
      };
    }
  }

  return Mixin as Constructor<RxStateMixinInterface> & TBase;
}
export {};
