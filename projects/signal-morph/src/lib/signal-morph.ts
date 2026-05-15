import { computed, effect, inject, Injector, Signal, signal, untracked } from '@angular/core';

/**
 * Signal transformation operator type.
 */
export type SignalOperator<T, R> = (source: Signal<T>) => Signal<R>;

/**
 * Functional pipeline to transform source signal through operators.
 */
export function morph<T>(source: Signal<T>, ...operators: SignalOperator<any, any>[]): Signal<any> {
  return operators.reduce((currentSignal, operator) => operator(currentSignal), source);
}

/**
 * Transforms signal values using a projection function.
 */
export function mapSignal<T, R>(project: (value: T) => R): SignalOperator<T, R> {
  return (source: Signal<T>) => computed(() => project(source()));
}

/**
 * Filters signal values based on a predicate.
 * Updates only when predicate returns true.
 */
export function filterSignal<T>(
  predicate: (value: T) => boolean,
  options?: { injector?: Injector },
): SignalOperator<T, T> {
  return (source: Signal<T>) => {
    const injector = options?.injector ?? inject(Injector);
    const filtered = signal<T>(untracked(source));

    effect(
      () => {
        const val = source();
        if (predicate(val)) {
          untracked(() => filtered.set(val));
        }
      },
      { injector, allowSignalWrites: true },
    );

    return filtered.asReadonly();
  };
}

/**
 * Executes side effect on value change.
 * Returns original signal unchanged.
 */
export function tapSignal<T>(callback: (value: T) => void, options?: { injector?: Injector }): SignalOperator<T, T> {
  return (source: Signal<T>) => {
    const injector = options?.injector ?? inject(Injector);

    effect(
      () => {
        callback(source());
      },
      { injector },
    );

    return source;
  };
}

/**
 * Emits only when value changes according to comparator.
 * Defaults to reference equality.
 */
export function distinctSignal<T>(comparator: (a: T, b: T) => boolean = (a, b) => a === b): SignalOperator<T, T> {
  return (source: Signal<T>) => computed(() => source(), { equal: comparator });
}

/**
 * Debounces signal changes by specified time (ms).
 */
export function debounceSignal<T>(time: number, options?: { injector?: Injector }): SignalOperator<T, T> {
  return (source: Signal<T>) => {
    const injector = options?.injector ?? inject(Injector);
    const debounced = signal<T>(untracked(source));

    effect(
      (onCleanup) => {
        const value = source();
        const timeout = setTimeout(() => {
          untracked(() => debounced.set(value));
        }, time);

        onCleanup(() => clearTimeout(timeout));
      },
      { injector, allowSignalWrites: true },
    );

    return debounced.asReadonly();
  };
}
