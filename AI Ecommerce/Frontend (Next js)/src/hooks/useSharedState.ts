/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect, useCallback } from "react";

const isSSR = typeof window === "undefined";

const EventTarget = isSSR ? (Object as unknown as typeof window.EventTarget) : window.EventTarget;

export class SharedStateTarget<T> extends EventTarget {
    initialStateOfNewComponents: T;

    constructor(initialStateOfNewComponents: T) {
        super();
        this.initialStateOfNewComponents = initialStateOfNewComponents;
    }

    useSharedState(): [T, (detail: T | ((prevState: T) => T)) => void] {
        const [state, setState] = useState<T>(this.initialStateOfNewComponents);
        const setSharedState = useCallback(
            (detail: T | ((prevState: T) => T)) =>
                super.dispatchEvent(new CustomEvent("set", { detail })),
            []
        );

        useEffect(() => {
            const eventListener = ({ detail }: CustomEvent<T | ((prevState: T) => T)>) => {
                if (typeof detail === "function") {
                    setState((prevState) => {
                        const nextState = (detail as (prevState: T) => T)(prevState);
                        this.initialStateOfNewComponents = nextState;
                        return nextState;
                    });
                } else {
                    this.initialStateOfNewComponents = detail;
                    setState(detail);
                }
            };

            super.addEventListener("set", eventListener);
            return () => super.removeEventListener("set", eventListener);
        }, []);

        return [state, setSharedState];
    }
}

export const CURRENT_ORDER_ID = new SharedStateTarget<any>('');
export const CART_QUEUE = new SharedStateTarget<any>([]);