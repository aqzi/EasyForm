export function objectToJson<T> (obj: T): string {
    return JSON.stringify(obj, null, 2);
}

export function jsonToObject<T> (str?: string): T|null {
    try {
        if (!str) return null;
        return JSON.parse(str);
    } catch (e) {
        return null;
    }
}