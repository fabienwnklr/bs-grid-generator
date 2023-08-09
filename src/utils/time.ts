export function debounce(func: Function, timeout = 300) {
    let timer = 0;
    return (...args: []) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}
