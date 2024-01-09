import { ReactiveController, ReactiveControllerHost } from 'lit';
import { BehaviorSubject } from 'rxjs';
import { pluck, distinctUntilChanged } from 'rxjs/operators';

import { INIT_STATE } from '../constants';
import { Command, IMetronomeState } from '../types';

export class RxStateController implements ReactiveController {
  public metronomeState$: BehaviorSubject<IMetronomeState> = new BehaviorSubject(INIT_STATE as IMetronomeState);
  public stateWorker: Worker;

  public isTicking$ = this.metronomeState$.pipe(pluck('isTicking'), distinctUntilChanged<boolean>());
  public beatsPerMinute$ = this.metronomeState$.pipe(pluck('beatsPerMinute'), distinctUntilChanged<number>());
  public beatsPerBar$ = this.metronomeState$.pipe(pluck('beatsPerBar'), distinctUntilChanged<number>());
  public counter$ = this.metronomeState$.pipe(pluck('counter'), distinctUntilChanged<number>());

  private host: ReactiveControllerHost;

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    this.host.addController(this);
  }

  hostConnected() {
    this.connectToStateWorker();
  }

  dispatchCommand(command: Command) {
    this.stateWorker.postMessage(command);
  }

  private connectToStateWorker() {
    this.stateWorker = new Worker(new URL('../workers/rx-state.worker.ts', import.meta.url), { type: 'module' });
    this.stateWorker.onmessage = (event) => {
      this.metronomeState$.next(event.data);
    };
  }
}
