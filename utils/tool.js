export function extend(o, n, override) {
    for (var p in n) {
        if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override))
            o[p] = n[p];
    }
}


export function error(message) {
    typeof console !== 'undefined' && console.error(`[html-router] ${message}`);
}