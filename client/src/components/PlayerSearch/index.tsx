import { Box, Input } from "@chakra-ui/react";
import { AutocompleteBox, AutocompleteItem } from "@/components/AutocompleteBox";
import React from "react";
import { useCombobox } from "downshift";
import { usePlayerSearchState } from "@/components/PlayerSearch/usePlayerSearchState";

export function PlayerSearch() {
    const [state, dispatch] = usePlayerSearchState();

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

    return (
        <Box position="relative">
            <Input placeholder="Search for a player..." {...getInputProps()} />
            <AutocompleteBox {...getMenuProps()} display={!isOpen || state.hits.length === 0 ? "none" : "block"}>
                {isOpen &&
                    state.hits.map((item, index) => (
                        <AutocompleteItem
                            variant={highlightedIndex === index ? "active" : "default"}
                            {...getItemProps({ item, index })}
                            key={item.player}
                        >
                            {item.player_name}
                        </AutocompleteItem>
                    ))}
            </AutocompleteBox>
        </Box>
    );
}
