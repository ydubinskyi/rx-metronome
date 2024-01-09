import { RxMetronomeStateWorker } from './rx-metronome-state-worker.class';

const ctx: Worker = (self as unknown) as Worker;
const workerInstance = new RxMetronomeStateWorker(ctx);
workerInstance.subscribeOnState();
