import { extendTheme, StyleFunctionProps } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { tabsTheme } from "@/theme/components/tabsTheme";
import { containerTheme } from "@/theme/components/containerTheme";
import { tableTheme } from "@/theme/components/tableTheme";
import { autocompleteTheme } from "@/theme/components/autocompleteTheme";

export const theme = extendTheme({
    initialColorMode: "dark",
    useSystemColorMode: false,
    components: {
        Container: containerTheme,
        Tabs: tabsTheme,
        Table: tableTheme,
        Autocomplete: autocompleteTheme,
    },
    textStyles: {
        logo: {
            textTransform: "uppercase",
            fontFamily: "monospace",
            color: "#ffc83c",
            fontWeight: "bold",
            fontSize: "1.5rem",
            // letterSpacing: "0.1rem",
        },
        accent: {
            fontFamily: "PT Mono,sans-serif",
        },
    },
    styles: {
        global: (props: StyleFunctionProps) => ({
            body: {
                bg: mode("transparent", "gray.800")(props),
                fontFamily: "PT Sans Caption,sans-serif",
            },
        }),
    },
});
