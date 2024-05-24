import { useReducer } from "react";
import { playerSearchReducer, PlayerSearchState } from "@/components/PlayerSearch/playerSearchReducer";
import { useHydrateSearchResults } from "@/components/PlayerSearch/useHydrateSearchResults";
import { useInvokeNavigateToPlayer } from "@/components/PlayerSearch/useInvokeNavigateToPlayer";
import { useCombobox, UseComboboxPropGetters } from "downshift";
import { PlayerSearchHit } from "@/api/useApi";

export function usePlayerSearch(): {
    state: PlayerSearchState;
    isOpen: boolean;
    getMenuProps: UseComboboxPropGetters<PlayerSearchHit>["getMenuProps"];
    getInputProps: UseComboboxPropGetters<PlayerSearchHit>["getInputProps"];
    highlightedIndex: number;
    getItemProps: UseComboboxPropGetters<PlayerSearchHit>["getItemProps"];
} {
    const [state, dispatch] = useReducer(playerSearchReducer, { hits: [], currentSearchTerm: "", redirectingTo: undefined });

    // In addition to the state object management, also invoke side effects invoked by state changes.
    useHydrateSearchResults(state, dispatch);
    useInvokeNavigateToPlayer(state);

    const { isOpen, getMenuProps, getInputProps, highlightedIndex, getItemProps, reset } = useCombobox({
        onInputValueChange({ inputValue, selectedItem }) {
            // Don't dispatch when this callback is triggered on an item selection, doing so will cause a new search
            // to execute, when we are instead waiting for the page to navigate to the player.
            if (inputValue !== selectedItem?.player_name) {
                dispatch({ name: "SEARCH_INPUT_CHANGED", value: inputValue });
            }
        },
        onSelectedItemChange({ selectedItem }) {
            dispatch({ name: "SEARCH_HIT_SELECTED", hit: { ...selectedItem } });
            reset();
        },
        items: state.hits,
        itemToString(item) {
            return item ? item.player_name : "";
        },
    });

    return {
        state,
        isOpen,
        getMenuProps,
        getInputProps,
        highlightedIndex,
        getItemProps,
    };
}
