export function debounce(fn: Function, ms = 300) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
}

export function addEvent(parent: Document | HTMLElement, evt: string, selector: string, handler: Function) {
  parent.addEventListener(
    evt,
    function (event) {
      const target = event.target as HTMLElement;
      if (target.matches(selector + ', ' + selector + ' *')) {
        handler.apply(target.closest(selector), arguments);
      }
    },
    false
  );
}
