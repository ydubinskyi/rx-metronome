import {BehaviorSubject, combineLatest, fromEvent, merge, NEVER, Observable, timer} from 'rxjs';
import {distinctUntilChanged, map, pluck, scan, shareReplay, switchMap, withLatestFrom} from 'rxjs/operators';

import {initState} from './constants';
import {Command} from './types/command.type';
import {IMetronomeState} from './types/metronome-state.interface';

const ctx: Worker = self as any;

const commands$ = fromEvent<{data: Command}>(ctx, 'message').pipe(map((event) => event.data));
const metronomeStateCommandBus$: BehaviorSubject<Command> = new BehaviorSubject(initState);
const metronomeState$: Observable<IMetronomeState> = merge(metronomeStateCommandBus$, commands$).pipe(
  scan((metronomeState: IMetronomeState, command) => ({...metronomeState, ...command})),
  shareReplay(1),
);

const isTicking$ = metronomeState$.pipe(pluck('isTicking'), distinctUntilChanged<boolean>());
const beatsPerMinute$ = metronomeState$.pipe(pluck('beatsPerMinute'), distinctUntilChanged<number>());

const counterUpdateTrigger$ = combineLatest([isTicking$, beatsPerMinute$]).pipe(
  switchMap(([isTicking, beatsPerMinute]) => (isTicking ? timer(0, 1000 * (60 / beatsPerMinute)) : NEVER)),
);

counterUpdateTrigger$.pipe(withLatestFrom(metronomeState$)).subscribe(([_, {beatsPerBar, counter}]) => {
  metronomeStateCommandBus$.next({
    counter: counter < beatsPerBar ? counter + 1 : 1,
  });
});

metronomeState$.subscribe((state) => {
  ctx.postMessage(state);
});
