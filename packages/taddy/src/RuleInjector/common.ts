export function buildAtomicRule(
    selector: string,
    key: string,
    value: string,
): string {
    return `${selector}{${key}:${value}}`;
}

const camelToKebabRe = /([a-z0-9]|(?=[A-Z]))([A-Z])/g;
export function camelToKebab(string): string {
    return string.replace(camelToKebabRe, '$1-$2').toLowerCase();
}

export function getStyleNodeById(id: string): HTMLStyleElement {
    let node = document.getElementById(id) as HTMLStyleElement;
    if (!node) {
        node = document.createElement('style');
        node.id = id;
        document.head.appendChild(node);
    }
    return node;
}
