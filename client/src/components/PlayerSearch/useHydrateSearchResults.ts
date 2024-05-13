import { PlayerSearchDispatch, PlayerSearchState } from "@/components/PlayerSearch/playerSearchReducer";
import { useEffect } from "react";
import { usePlayerSearch } from "@/api/useApi";

export function useHydrateSearchResults(state: PlayerSearchState, dispatch: PlayerSearchDispatch) {
    useEffect(() => {
        if (!state.currentSearchTerm) {
            return;
        }
        usePlayerSearch(state.currentSearchTerm).then((res) => dispatch({ name: "SEARCH_HITS_RETURNED", hits: res.hits }));
    }, [state.currentSearchTerm]);
}
