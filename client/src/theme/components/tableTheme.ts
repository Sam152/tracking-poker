import { tableAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(tableAnatomy.keys);

const baseStyle = definePartsStyle({
    tr: {
        "td:last-child": {
            textAlign: "right",
        },
        "td:first-child": {
            textAlign: "left",
        },
    },
});

export const tableTheme = defineMultiStyleConfig({ baseStyle });
