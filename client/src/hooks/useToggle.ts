import { useState } from "react";

export function useToggle(defaultState: boolean = false): [boolean, () => void] {
    const [state, setState] = useState<boolean>(defaultState);
    const toggle = () => setState(!state);
    return [state, toggle];
}
