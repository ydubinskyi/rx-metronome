import { BehaviorSubject, combineLatest, fromEvent, merge, NEVER, Observable, timer } from 'rxjs';
import { distinctUntilChanged, map, pluck, scan, shareReplay, switchMap, withLatestFrom } from 'rxjs/operators';

import { INIT_STATE } from '../constants';
import { Command } from '../types';
import { IMetronomeState } from '../types/metronome-state.interface';

export class RxMetronomeStateWorker {
  public context: Worker;

  public commands$: Observable<Command>;
  public metronomeStateCommandBus$: BehaviorSubject<Command> = new BehaviorSubject(INIT_STATE as Command);
  public metronomeState$: Observable<IMetronomeState>;
  public isTicking$: Observable<boolean>;
  public beatsPerMinute$: Observable<number>;

  public counterUpdateTrigger$: Observable<number>;

  constructor(context: Worker) {
    this.context = context;

    this.commands$ = fromEvent<{ data: Command }>(this.context, 'message').pipe(map((event) => event.data));
    this.metronomeState$ = merge(this.metronomeStateCommandBus$, this.commands$).pipe(
      scan((metronomeState: any, command: any) => ({ ...metronomeState, ...command })),
      shareReplay(1),
    );
    this.isTicking$ = this.metronomeState$.pipe(pluck('isTicking'), distinctUntilChanged<boolean>());
    this.beatsPerMinute$ = this.metronomeState$.pipe(pluck('beatsPerMinute'), distinctUntilChanged<number>());

    this.counterUpdateTrigger$ = combineLatest([this.isTicking$, this.beatsPerMinute$]).pipe(
      switchMap(([isTicking, beatsPerMinute]) => (isTicking ? timer(0, 1000 * (60 / beatsPerMinute)) : NEVER)),
    );
  }

  public subscribeOnState() {
    this.counterUpdateTrigger$.pipe(withLatestFrom(this.metronomeState$)).subscribe(([_, { beatsPerBar, counter }]) => {
      this.metronomeStateCommandBus$.next({
        counter: counter < beatsPerBar ? counter + 1 : 1,
      });
    });

    this.metronomeState$.subscribe((state) => {
      this.context.postMessage(state);
    });
  }
}
