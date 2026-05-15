import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { debounceSignal, distinctSignal, filterSignal, mapSignal, morph, tapSignal } from './signal-morph';

describe('SignalMorph Operators', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('morph() should pipe operators', () => {
    const src = signal(1);
    const result = morph(
      src,
      mapSignal((v) => v + 1),
      mapSignal((v) => v * 10),
    );

    expect(result()).toBe(20);
    src.set(5);
    expect(result()).toBe(60);
  });

  it('mapSignal() should transform values', () => {
    const src = signal('hello');
    const result = morph(
      src,
      mapSignal((s) => s.toUpperCase()),
    );

    expect(result()).toBe('HELLO');
    src.set('world');
    expect(result()).toBe('WORLD');
  });

  it('filterSignal() should skip values not matching predicate', () => {
    TestBed.runInInjectionContext(() => {
      const src = signal(1);
      const result = morph(
        src,
        filterSignal((v) => v % 2 === 0),
      );

      expect(result()).toBe(1);

      src.set(2);
      TestBed.flushEffects();
      expect(result()).toBe(2);

      src.set(3);
      TestBed.flushEffects();
      expect(result()).toBe(2);

      src.set(4);
      TestBed.flushEffects();
      expect(result()).toBe(4);
    });
  });

  it('tapSignal() should execute side effects', () => {
    TestBed.runInInjectionContext(() => {
      const src = signal(1);
      let tappedValue = 0;

      const result = morph(
        src,
        tapSignal((v) => (tappedValue = v)),
      );

      TestBed.flushEffects();
      expect(result()).toBe(1);
      expect(tappedValue).toBe(1);

      src.set(100);
      TestBed.flushEffects();
      expect(tappedValue).toBe(100);
      expect(result()).toBe(100);
    });
  });

  it('distinctSignal() should avoid duplicate updates', () => {
    TestBed.runInInjectionContext(() => {
      const src = signal({ id: 1, name: 'A' });
      let computations = 0;

      const result = morph(
        src,
        distinctSignal((a, b) => a.id === b.id),
        tapSignal(() => computations++),
      );

      TestBed.flushEffects();
      expect(result().id).toBe(1);
      expect(computations).toBe(1);

      src.set({ id: 1, name: 'B' });
      TestBed.flushEffects();
      expect(result().name).toBe('A');
      expect(computations).toBe(1);

      src.set({ id: 2, name: 'C' });
      TestBed.flushEffects();
      expect(result().id).toBe(2);
      expect(computations).toBe(2);
    });
  });

  it('debounceSignal() should delay updates', () => {
    vi.useFakeTimers();
    TestBed.runInInjectionContext(() => {
      const src = signal(1);
      const result = morph(src, debounceSignal(100));

      expect(result()).toBe(1);

      src.set(2);
      TestBed.flushEffects();

      vi.advanceTimersByTime(50);
      expect(result()).toBe(1);

      vi.advanceTimersByTime(51);
      expect(result()).toBe(2);
    });
    vi.useRealTimers();
  });

  it('debounceSignal() should reset timer on rapid changes', () => {
    vi.useFakeTimers();
    TestBed.runInInjectionContext(() => {
      const src = signal(1);
      const result = morph(src, debounceSignal(100));

      src.set(2);
      TestBed.flushEffects();
      vi.advanceTimersByTime(50);

      src.set(3);
      TestBed.flushEffects();
      vi.advanceTimersByTime(50);
      expect(result()).toBe(1);

      vi.advanceTimersByTime(51);
      expect(result()).toBe(3);
    });
    vi.useRealTimers();
  });
});
