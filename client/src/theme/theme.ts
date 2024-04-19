import { extendTheme, StyleFunctionProps } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

export const theme = extendTheme({
    initialColorMode: "dark",
    useSystemColorMode: false,
    components: {
        Container: {
            baseStyle: {
                maxW: "880px",
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
