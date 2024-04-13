export type StampedType<T, S> = T & { __stamp: S };

// @todo, how to validate input type can be extracted from T? Why doesn't this work?
type ExtractStampedPrimitive<T> = T extends StampedType<infer U, any> ? U : never;

export function stamp<T>(input: any): T {
    return input as T;
}
