import { useReducer } from "react";
import { PlayerSearchDispatch, playerSearchReducer, PlayerSearchState } from "@/components/PlayerSearch/playerSearchReducer";
import { useHydrateSearchResults } from "@/components/PlayerSearch/useHydrateSearchResults";
import { useInvokeNavigateToPlayer } from "@/components/PlayerSearch/useInvokeNavigateToPlayer";

export function usePlayerSearchState(): [PlayerSearchState, PlayerSearchDispatch] {
    const [state, dispatch] = useReducer(playerSearchReducer, { hits: [], currentSearchTerm: "", redirectingTo: undefined });

    // In addition to the state object management, also invoke side effects invoked by state changes.
    useHydrateSearchResults(state, dispatch);
    useInvokeNavigateToPlayer(state);

    return [state, dispatch];
}
