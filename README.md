# @sirse-dev/safe-context

> Safe React context

[![npm version](https://img.shields.io/npm/v/@sirse-dev/safe-context)](https://www.npmjs.com/package/@sirse-dev/safe-context)
[![npm downloads](https://img.shields.io/npm/dw/@sirse-dev/safe-context)](https://www.npmjs.com/package/@sirse-dev/safe-context)
[![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@sirse-dev/safe-context)](https://www.npmjs.com/package/@sirse-dev/safe-context)

## Why?

React requires default value for the context. However, in some cases, default value doesn't have any meaning, because consumers cannot exist outside Provider. SafeContext lets you to have context, that could be used only inside provider. Trying to use `Consumer` or `useSafeContext` outside `Provider` will result in runtime error.

## Install

```bash
npm install @sirse-dev/safe-context
```

Or

```bash
yarn add @sirse-dev/safe-context
```

## Usage

```tsx
import { createSafeContext, useSafeContext } from '@sirse-dev/safe-context';

//     This should be non-nullable type ↓      ↓ - no default value.
const SampleContext = createSafeContext<number>();

// Use it as standard context.
const App = () => {
    return (
        <SampleContext.Provider value={10}>
            {/* Some app code... */}

            <SampleContext.Consumer>{(value) => <p>{value}</p>}</SampleContext.Consumer>
            <InnerComponent />
        </SampleContext.Provider>
    );
};

// Or from hook api
const InnerComponent = () => {
    const value = useSafeContext(SampleContext);

    return <div>{value}</div>;
};
```

## License

MIT © [sirse](https://github.com/ArtiomTr)

[Created with aqu 🌊](https://github.com/ArtiomTr/aqu#readme)
