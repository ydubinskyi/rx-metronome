import {RxMetronomeStateWorker} from './rx-metronome-state-worker.class';

const ctx: Worker = self as any;
const workerInstance = new RxMetronomeStateWorker(ctx);
workerInstance.subscribeOnState();
