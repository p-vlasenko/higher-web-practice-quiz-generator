import { isDefined, isUndefined } from '../utils';
import { curry } from './curry';

type Optional<T> = T | undefined;

type Mapper<T, U> = (arg: T) => U;

export namespace Optional {
    type FMap = {
        <T, U>(fn: Mapper<T, U>, arg: Optional<T>): U | undefined;
        <T, U>(fn: Mapper<T, U>): (arg: Optional<T>) => U | undefined;
    };

    type FAp = {
        <T, U>(fn: Optional<Mapper<T, U>>, arg: Optional<T>): U | undefined;
        <T, U>(fn: Optional<Mapper<T, U>>): (arg: Optional<T>) => U | undefined;
    };

    export const map: FMap = curry(<T, U>(fn: Mapper<T, U>, val: Optional<T>): U | undefined =>
        isDefined(val) ? fn(val) : undefined);

    export const ap: FAp = curry(<T, U>(fn: Optional<(arg: T) => U>, val: Optional<T>): U | undefined =>
        (isUndefined(val) || isUndefined(fn) ? undefined : fn(val)));
}
