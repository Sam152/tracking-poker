export function fill<T>(elements: number, value: T): Array<T>;
export function fill(elements: number): Array<undefined>;

export function fill<T>(elements: number, value: T | undefined = undefined) {
    return new Array(elements).fill(value);
}
