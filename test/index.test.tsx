import React, { Context, useContext } from 'react';
import { render, renderHook } from '@testing-library/react';

import { createSafeContext, useSafeContext } from '../src';

describe('createSafeContext', () => {
    it('should not throw', () => {
        expect(() => createSafeContext()).not.toThrow();
    });

    it('should return new context', () => {
        const context = createSafeContext();

        expect(context.Provider).toBeDefined();
        expect(context.Consumer).toBeDefined();
    });
});

describe('SafeProvider', () => {
    it('should work as normal provider', () => {
        const SampleContext = createSafeContext();

        const testValue = {};

        const { result } = renderHook(
            () => useContext((SampleContext as unknown as { context: Context<unknown> }).context),
            {
                wrapper: ({ children }) => (
                    <SampleContext.Provider value={testValue}>{children}</SampleContext.Provider>
                ),
            },
        );

        expect(result.current).toBe(testValue);
    });

    it('should throw error if value is undefined', () => {
        const SampleContext = createSafeContext();

        let error: Error | undefined = undefined;

        try {
            render(<SampleContext.Provider value={undefined} />);
        } catch (receivedError: unknown) {
            error = receivedError as Error;
        }

        expect(error).toBeDefined();
    });
});

describe('SafeConsumer', () => {
    it('should work as normal consumer', () => {
        const SampleContext = createSafeContext();

        const testValue = {};

        const consumerTester = jest.fn();

        render(
            <SampleContext.Provider value={testValue}>
                <SampleContext.Consumer>{consumerTester}</SampleContext.Consumer>
            </SampleContext.Provider>,
        );

        expect(consumerTester.mock.calls[0][0]).toBe(testValue);
    });

    it('should throw error if not wrapped into provider', () => {
        const SampleContext = createSafeContext();

        let error: Error | undefined = undefined;

        const consumerTester = jest.fn();

        try {
            render(<SampleContext.Consumer>{consumerTester}</SampleContext.Consumer>);
        } catch (receivedError: unknown) {
            error = receivedError as Error;
        }

        expect(error).toBeDefined();
        expect(consumerTester).not.toBeCalled();
    });
});

describe('useSafeContext', () => {
    it('should work as normal useContext', () => {
        const SampleContext = createSafeContext();

        const testValue = {};

        const { result } = renderHook(() => useSafeContext(SampleContext), {
            wrapper: ({ children }) => <SampleContext.Provider value={testValue}>{children}</SampleContext.Provider>,
        });

        expect(result.current).toBe(testValue);
    });

    it('should throw error if not wrapped into provider', () => {
        const SampleContext = createSafeContext();
        SampleContext.displayName = 'SampleContext';

        let error: Error | undefined = undefined;

        try {
            renderHook(() => useSafeContext(SampleContext));
        } catch (receivedError: unknown) {
            error = receivedError as Error;
        }

        expect(error).toBeDefined();
        expect(error?.message).toMatchSnapshot();
    });

    it('should throw error if not wrapped into provider (no display name)', () => {
        const SampleContext = createSafeContext();
        SampleContext.displayName = undefined;

        let error: Error | undefined = undefined;

        try {
            renderHook(() => useSafeContext(SampleContext));
        } catch (receivedError: unknown) {
            error = receivedError as Error;
        }

        expect(error).toBeDefined();
        expect(error?.message).toMatchSnapshot();
    });
});
