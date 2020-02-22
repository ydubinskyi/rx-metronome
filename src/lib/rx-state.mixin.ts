import {property} from 'lit-element';
import {BehaviorSubject, Subject} from 'rxjs';
import {bufferCount, distinctUntilChanged, filter, map, pluck, takeUntil, timeInterval} from 'rxjs/operators';

import {initState} from './constants';
import {Command, Constructor, IMetronomeState} from './types';

export function RxStateMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    public metronomeState$: BehaviorSubject<IMetronomeState> = new BehaviorSubject(initState);
    public stateWorker: Worker;

    public isTicking$ = this.metronomeState$.pipe(pluck('isTicking'), distinctUntilChanged<boolean>());
    public beatsPerMinute$ = this.metronomeState$.pipe(pluck('beatsPerMinute'), distinctUntilChanged<number>());
    public beatsPerBar$ = this.metronomeState$.pipe(pluck('beatsPerBar'), distinctUntilChanged<number>());
    public counter$ = this.metronomeState$.pipe(pluck('counter'), distinctUntilChanged<number>());

    public dispatchCommand(command: Command) {
      this.stateWorker.postMessage(command);
    }

    public connectToStateWorker() {
      this.stateWorker = new Worker('./rx-state.worker.ts', {type: 'module'});
      this.stateWorker.onmessage = (event) => {
        this.metronomeState$.next(event.data);
      };
    }
  };
}
