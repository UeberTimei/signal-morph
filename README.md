# 🧪 signal-morph

Lightweight, UNIX-way utilities for transforming Angular Signals.

[![npm version](https://badge.fury.io/js/signal-morph.svg)](https://badge.fury.io/js/signal-morph)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Philosophy

1.  **Do one thing well**: Each operator performs a single, specific task.
2.  **Composability**: Combine operators into powerful pipelines using `morph`.
3.  **Tree-shakeable**: Zero classes, zero monolithic services. Only pure functions.
4.  **Zero Dependencies**: Uses only `@angular/core`. No RxJS or Lodash required.

## 🚀 Installation

```bash
bun add signal-morph
# or
npm install signal-morph
```

## 📖 Quick Start

```typescript
import { signal } from '@angular/core';
import { morph, mapSignal, filterSignal } from 'signal-morph';

const count = signal(0);

// Create a reactive pipeline
const doubleEven = morph(
  count,
  filterSignal(n => n % 2 === 0),
  mapSignal(n => n * 2)
);

console.log(doubleEven()); // 0
count.set(1);
console.log(doubleEven()); // 0 (filtered)
count.set(2);
console.log(doubleEven()); // 4
```

## 🛠 Operators

### `morph(source, ...operators)`
The core pipeline function. Takes a source signal and applies operators sequentially.

### `mapSignal(project)`
Transforms the value using a projection function.
```typescript
mapSignal(v => v.toUpperCase())
```

### `filterSignal(predicate)`
Only propagates values that satisfy the condition. Keeps the last valid value.
```typescript
filterSignal(n => n > 0)
```

### `tapSignal(callback)`
Performs side effects (logging, analytics) without modifying the signal.
```typescript
tapSignal(v => console.log('Value changed:', v))
```

### `distinctSignal(comparator?)`
Skips updates if the new value is equal to the old one.
```typescript
distinctSignal((a, b) => a.id === b.id)
```

### `debounceSignal(timeMs)`
Delays propagation until a period of silence.
```typescript
debounceSignal(300)
```

## 📄 License
MIT © 2024
