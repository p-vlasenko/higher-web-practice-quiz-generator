import { curry } from './curry';

export type Left<T = unknown> = [T, undefined];
export type Right<T = unknown> = [undefined, T];

type Either<L = unknown, R = unknown> = Left<L> | Right<R>;

export type LeftOf<T extends Either> = T extends Left<infer U> ? U : never;
export type RightOf<T extends Either> = T extends Right<infer U> ? U : never;

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Either {
    export const left = <T>(val: T): Left<T> => [val, undefined];
    export const right = <T>(val: T): Right<T> => [undefined, val];
    export const of = <T>(val: T): Right<T> => right(val);

    export const isLeft = <L, R>(either: Either<L, R>): either is Left<L> => getLeft(either) !== undefined;
    export const isRight = <L, R>(either: Either<L, R>): either is Right<R> => !isLeft(either);

    const getLeft = <E extends Either>(either: E): LeftOf<E> => either[0] as LeftOf<E>;
    const getRight = <E extends Either>(either: E): RightOf<E> => either[1] as RightOf<E>;

    type ToUnion = <E extends Either>(either: E) => E extends Left<infer E>
        ? E : E extends Right<infer V> ? V : LeftOf<E> | RightOf<E>;

    export const toUnion = (either => isLeft(either) ? getLeft(either) : getRight(either)) as ToUnion;

    type Match = {
        <E extends Either, T>(onLeft: (left: LeftOf<E>) => T, onRight: (right: RightOf<E>) => T): (either: E) => T;
        <E extends Either, T>(onLeft: (left: LeftOf<E>) => T, onRight: (right: RightOf<E>) => T, either: E): T;
    };

    export const match: Match = curry(
        <E extends Either, T>(
            onLeft: (left: LeftOf<E>) => T,
            onRight: (right: RightOf<E>) => T, either: E,
        ) => isLeft(either) ? onLeft(getLeft(either)) : onRight(getRight(either)),
    );

    type MatchW = {
        <L, R, LR, RR>(onLeft: (left: L) => LR, onRight: (right: R) => RR): (either: Either<L, R>) => LR | RR;
        <L, R, LR, RR>(onLeft: (left: L) => LR, onRight: (right: R) => RR, either: Either<L, R>): LR | RR;
    };

    export const matchW: MatchW = curry(
        <L, R, LR, RR>(onLeft: (left: L) => LR, onRight: (right: R) => RR, either: Either<L, R>) =>
            isLeft(either) ? onLeft(getLeft(either)) : onRight(getRight(either)),
    );

    type Map = {
        <L, R, T>(fn: (right: R) => T, either: Either<L, R>): Either<L, T>;
        <R, T>(fn: (right: R) => T): <L>(either: Either<L, R>) => Either<L, T>;
    };

    export const map = curry(
        <L, R, T>(fn: (right: R) => T, either: Either<L, R>): Either<L, T> =>
            isRight(either) ? right(fn(getRight(either))) : either,
    ) as Map;

    type MapLeft = {
        <L, R, T>(fn: (left: L) => T, either: Either<L, R>): Either<T, R>;
        <L, T>(fn: (left: L) => T): <R>(either: Either<L, R>) => Either<T, R>;
    };

    export const mapLeft = curry(
        <L, R, T>(fn: (left: L) => T, either: Either<L, R>): Either<T, R> =>
            isLeft(either) ? left(fn(getLeft(either))) : either,
    ) as MapLeft;

    type GetOrElseRes<E extends Either, T> = E extends Left
        ? T : E extends Right<infer R> ? R : RightOf<E> | T;

    type GetOrElse = {
        <E extends Either, T>(onLeft: (left: LeftOf<E>) => T, either: E): GetOrElseRes<E, T>;
        <L, T>(onLeft: (left: L) => T): <E extends Either<L>>(either: E) => GetOrElseRes<E, T>;
    };

    export const getOrElse = curry(
        <L, R, T>(onLeft: (left: L) => T, either: Either<L, R>): T | R =>
            isLeft(either) ? onLeft(getLeft(either)) : getRight(either),
    ) as GetOrElse;

    type BiMap = {
        <L, R, LR, RR>(onLeft: (left: L) => LR, onRight: (right: R) => RR): (either: Either<L, R>) => Either<LR, RR>;
        <L, R, LR, RR>(onLeft: (left: L) => LR, onRight: (right: R) => RR, either: Either<L, R>): Either<LR, RR>;
    };

    type GetOrThrow = {
        <L, R, E>(makeErrorFromLeft: (left: L) => E, arg: Either<L, R>): R | never;
        <L, E>(makeErrorFromLeft: (left: L) => E): <E extends Either<L>>(arg: E) => Right | never;
    };

    const throwErr = <T>(err: T): never => {
        throw err;
    };

    export const getOrThrow = curry(
        (makeErrorFromLeft, either) => isLeft(either) ? throwErr(makeErrorFromLeft(getLeft(either))) : getRight(either),
    ) as GetOrThrow;

    type Apply = {
        <L, R, R1>(fnE: Either<L, (param: R) => R1>, either: Either<L, R>): Either<L, R1>;
        <L, R, R1>(fnE: Either<L, (param: R) => R1>): (either: Either<L, R>) => Either<L, R1>;
    };

    export const apply: Apply = curry(
        <L, R, R1>(fnE: Either<L, (param: R) => R1>, either: Either<L, R>): Either<L, R1> =>
            isLeft(either) ? either : isLeft(fnE) ? fnE : right(getRight(fnE)(getRight(either))),
    );

    export const bimap = curry(
        <L, R, LR, RR>(
            onLeft: (left: L) => LR,
            onRight: (right: R) => RR,
            either: Either<L, R>,
        ): Either<LR, RR> =>
            isLeft(either) ? left(onLeft(getLeft(either))) : right(onRight(getRight(either))),
    ) as unknown as BiMap;

    export const chain = <E extends Either, L, R>(
        fn: (right: RightOf<E>) => Either<L, R>,
        either: E,
    ): Either<LeftOf<E> | L, R> => isLeft(either) ? either as Left<LeftOf<E>> : fn(getRight(either));
}

export {
    Either,
};
