// Generated by dts-bundle v0.5.0

declare module 'iterables' {
    export { default as enumerate } from "iterables/enumerate";
    export { default as range } from "iterables/range_iterator";
}

declare module 'iterables/enumerate' {
    import Enumerable from "iterables/enumerable";
    export default function <T>(iterable: Iterable<T>): Enumerable<T>;
}

declare module 'iterables/range_iterator' {
    import Enumerable from "iterables/enumerable";
    export default function (start: number, stop: number, step?: number): Enumerable<number>;
}

declare module 'iterables/enumerable' {
    import { Predicate } from "iterables/predicate";
    export default class Enumerable<T> {
        constructor(iterable: Iterable<T>);
        [Symbol.iterator](): Iterator<T>;
        every(predicate: Predicate<T>): boolean;
        expand(expansion: (e: T) => T[]): Enumerable<T[]>;
        filter(predicate: Predicate<T>): Enumerable<T>;
        flatten(): Enumerable<T>;
        join(separator?: string): string;
        map<R>(block: (value: T) => R): Enumerable<R>;
        reduce(accumulator: (prev: T, element: T) => T, initialValue?: T): T | undefined;
        reduce<R>(accumulator: (prev: R, element: T) => R, initialValue: R): R;
        forEach(block: (value: T) => void): void;
        skip(count: number): Enumerable<T>;
        some(predicate: Predicate<T>): boolean;
        take(count: number): Enumerable<T>;
        toArray(): T[];
        readonly first: T | null;
        readonly last: T | null;
        readonly length: number;
        readonly isEmpty: boolean;
        readonly isNotEmpty: boolean;
        protected iterator(): Iterator<T>;
    }
}

declare module 'iterables/predicate' {
    export type Predicate<T> = (value: T) => boolean;
}

