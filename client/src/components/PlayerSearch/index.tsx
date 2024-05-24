import { Box, Input } from "@chakra-ui/react";
import { AutocompleteBox, AutocompleteItem } from "@/components/AutocompleteBox";
import React from "react";
import { usePlayerSearch } from "@/components/PlayerSearch/usePlayerSearch";

export function PlayerSearch() {
    const { state, isOpen, getMenuProps, getInputProps, highlightedIndex, getItemProps } = usePlayerSearch();
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
