// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnaryFn<P = any, R = any> = (p: P) => R;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ZeroAryFn<R = any> = () => R;

export type LastItem<T extends readonly unknown[]> = T extends readonly [infer U, ...infer V]
    ? [] extends V ? U : LastItem<V>
    : never;

export type LastFnResult<T extends UnaryFn[]> = LastItem<T> extends UnaryFn ? ReturnType<LastItem<T>> : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FlowParams<Fn extends UnaryFn | ZeroAryFn, Fns extends any[]>
    = [] extends Fns ? [Fn] :
    Fns extends [infer Fn1, ...infer Rest]
        ? Fn1 extends UnaryFn<ReturnType<Fn>> ? [Fn, ...FlowParams<Fn1, Rest>]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        : [Fn, (p: ReturnType<Fn>) => any, ...UnaryFn[]]
        : [];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type FlowResult<Fns extends UnaryFn[]> = Fns extends [infer F0, ...infer Rest]
    ? F0 extends ZeroAryFn ? () => LastFnResult<Fns>
    : F0 extends UnaryFn<infer P> ? (p: P) => LastFnResult<Fns>
    : () => LastFnResult<Fns>
    : () => LastFnResult<Fns>;

export const flow = <Fn extends ZeroAryFn | UnaryFn, Fns extends UnaryFn[]>(
    ...fns: [Fn, ...Fns] & FlowParams<Fn, Fns>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): FlowResult<[Fn, ...Fns]> => ((param: any) =>
    fns.reduce((result, fn) => fn(result), param)) as unknown as FlowResult<[Fn, ...Fns]>;
