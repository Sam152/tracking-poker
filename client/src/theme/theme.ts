import { extendTheme, StyleFunctionProps } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

export const theme = extendTheme({
    initialColorMode: "dark",
    useSystemColorMode: false,
    components: {
        Container: {
            baseStyle: {
                maxW: "700px",
            },
        },
        Tabs: {
            baseStyle: {
                tab: {
                    borderBottomWidth: "5px",
                },
            },
        },
    },
    styles: {
        global: (props: StyleFunctionProps) => ({
            body: {
                bg: mode("transparent", "gray.800")(props),
            },
        }),
    },
});
