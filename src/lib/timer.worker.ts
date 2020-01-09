const ctx: Worker = self as any;

let timerID = null;
let interval = 100;

ctx.onmessage = (e: MessageEvent) => {
  if (e.data === 'start') {
    timerID = setInterval(() => {
      ctx.postMessage('tick');
    }, interval);
  } else if (e.data.interval) {
    interval = e.data.interval;

    if (timerID) {
      clearInterval(timerID);
      timerID = setInterval(() => {
        ctx.postMessage('tick');
      }, interval);
    }
  } else if (e.data === 'stop') {
    clearInterval(timerID);
    timerID = null;
  }
};
