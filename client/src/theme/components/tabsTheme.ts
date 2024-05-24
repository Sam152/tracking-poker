import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(tabsAnatomy.keys);

// define the base component styles
const baseStyle = definePartsStyle({
    // define the part you're going to style
    tab: {
        textStyle: "accent",
        fontWeight: 600,
        textTransform: "uppercase",
        borderBottomWidth: "7px!important",
        _selected: {},
    },
    tablist: {
        mb: 0,
    },
});

// export the component theme
export const tabsTheme = defineMultiStyleConfig({ baseStyle });
