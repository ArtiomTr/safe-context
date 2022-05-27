import React, { Context, createContext, FunctionComponent, PropsWithChildren, useContext } from 'react';
import invariant from 'tiny-invariant';

export type SafeProviderProps<T> = PropsWithChildren<{
    value: T;
}>;

export type SafeConsumerProps<T> = {
    children: (value: T) => React.ReactNode;
};

export type SafeContext<T> = {
    Provider: FunctionComponent<SafeProviderProps<T>>;
    Consumer: FunctionComponent<SafeConsumerProps<T>>;
    displayName?: string;
};

export const useSafeContext = <T,>(safeContext: SafeContext<T>): T => {
    const contextValue = useContext((safeContext as unknown as { context: Context<T | undefined> }).context);

    invariant(
        contextValue !== undefined,
        `Trying to access ${safeContext.displayName ?? 'SafeContext'} outside provider.`,
    );

    return contextValue;
};

export const createSafeContext = <T,>(): SafeContext<NonNullable<T>> => {
    const UnsafeContext = createContext<NonNullable<T> | undefined>(undefined);

    const safeContext = {
        Provider: ({ value, children }: SafeProviderProps<NonNullable<T>>) => {
            invariant(value !== undefined, 'SafeContext.Provider cannot provide `undefined` value.');

            return <UnsafeContext.Provider value={value}>{children}</UnsafeContext.Provider>;
        },
        Consumer: ({ children }: SafeConsumerProps<NonNullable<T>>) => {
            const value = useSafeContext(safeContext);

            return <React.Fragment>{children(value)}</React.Fragment>;
        },
        context: UnsafeContext,
    };

    return safeContext;
};
