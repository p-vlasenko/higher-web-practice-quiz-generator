type Fn0<R> = () => R;
type Fn1<P0, R> = (p0: P0) => R;
type Fn2<P0, P1, R> = (...p: [P0, P1]) => R;
type Fn3<P0, P1, P2, R> = (...p: [P0, P1, P2]) => R;
type Fn4<P0, P1, P2, P3, R> = (...p: [P0, P1, P2, P3]) => R;

type CurriedF2<P0, P1, R> = {
    (p: P0): (p: P1) => R;
    (p0: P0, p1: P1): R;
};

type CurriedF3<P0, P1, P2, R> = {
    (p: P0): CurriedF2<P1, P2, R>;
    (p0: P0, p1: P1): (p: P2) => R;
};

type CurriedF4<P0, P1, P2, P3, R> = {
    (p: P0): CurriedF3<P1, P2, P3, R>;
    (p0: P0, p1: P1): CurriedF2<P2, P3, R>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Curried<T extends (...args: any[]) => unknown> = T extends Fn0<infer R> ? Fn0<R> :
    T extends Fn1<infer P0, infer R> ? Fn1<P0, R> :
    T extends Fn2<infer P0, infer P1, infer R> ? CurriedF2<P0, P1, R> :
    T extends Fn3<infer P0, infer P1, infer P2, infer R> ? CurriedF3<P0, P1, P2, R> :
    T extends Fn4<infer P0, infer P1, infer P2, infer P3, infer R> ? CurriedF4<P0, P1, P2, P3, R> :
    never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const curry = <T extends (...p: any[]) => unknown>(fn: T) => {
    return function curried(this: unknown, ...params: unknown[]) {
        return params.length >= fn.length
            ? fn.apply(this, params)
            : function (this: unknown, ...args2: unknown[]) {
                return curried.apply(this, [...params, ...args2] as unknown[]);
            };
    } as Curried<T>;
};

export {
    curry,
};
