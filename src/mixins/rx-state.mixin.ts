import { LitElement } from 'lit';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';

import { INIT_STATE } from '../constants';
import { Command, Constructor, IMetronomeState } from '../types';

export function RxStateMixin<TBase extends Constructor<LitElement>>(Base: TBase) {
  class Mixin extends Base {
    public metronomeState$: BehaviorSubject<IMetronomeState> = new BehaviorSubject(INIT_STATE);
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

  return Mixin;
}
