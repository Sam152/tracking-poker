import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";

const helpers = createMultiStyleConfigHelpers(["box", "item"]);

export const autocompleteTheme = helpers.defineMultiStyleConfig({
    baseStyle: {
        box: {
            bg: "#111620",
            position: "absolute",
            top: "100%",
            right: 0,
            left: 0,
            p: 2,
            zIndex: 1500,
            border: "1px solid black",
        },
        item: {
            p: 2,
            borderRadius: 5,
            cursor: "pointer",
        },
    },
    sizes: {},
    variants: {
        active: {
            item: {
                bg: "#2d3648",
            },
        },
    },
    defaultProps: {},
});
