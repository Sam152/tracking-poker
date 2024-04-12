export type StampedType<T, S> = T & { __stamp: S };

type ExtractStampedPrimitive<T> = T extends StampedType<infer U, any> ? U : never;

// @todo, how to validate input type can be extracted from T?
export function stamp<T>(input: any): T {
    return input as T;
}
