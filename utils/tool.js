export function extend(o, n, override) {
    for (var p in n) {
        if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override))
            o[p] = n[p];
    }
}


export function error(message) {
    typeof console !== 'undefined' && console.error(`[html-router] ${message}`);
}

export function isAssetTypeAnImage(filename) {
    let index = filename.lastIndexOf('.');
    //获取后缀
    let ext = filename.substr(index + 1);
    return (
        [
            'png',
            'jpg',
            'jpeg',
            'bmp',
            'gif',
            'webp',
            'psd',
            'svg',
            'tiff',
        ].indexOf(ext.toLowerCase()) !== -1
    );
}