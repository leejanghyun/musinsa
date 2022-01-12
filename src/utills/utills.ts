export function throttle(callback: any, limit: number) {
  let waiting = false;
  return function(...args: any) {
    if (waiting) {
      return;
    }
    callback.apply(this, args);
    waiting = true;
    setTimeout(() => {
        waiting = false;
    }, limit);
  }
}