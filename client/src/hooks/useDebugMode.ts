import { createContext, useContext } from "react";

export const DebugContext = createContext<boolean>(false);

export function useDebugMode(): boolean {
    return useContext(DebugContext);
}
