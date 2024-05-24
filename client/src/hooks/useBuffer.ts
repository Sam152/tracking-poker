import { useState } from "react";

/**
 * Like useState, but a fixed size buffer of items.
 */
export function useBuffer<T>(items: number): [Array<T>, (value: T) => void] {
    const [state, setState] = useState<Array<T>>([]);

    function pushIntoBuffer(value: T) {
        setState((prevState) => {
            const newState = [...prevState, value];
            while (newState.length > items) {
                newState.shift();
            }
            return newState;
        });
    }

    return [state, pushIntoBuffer];
}
