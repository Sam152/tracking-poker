import { Box, BoxProps, forwardRef, useMultiStyleConfig } from "@chakra-ui/react";
import { ReactNode } from "react";

export const AutocompleteBox = forwardRef<BoxProps & { children: ReactNode }, "div">(function ({ children, ...rest }, ref) {
    const styles = useMultiStyleConfig("Autocomplete", {});
    return (
        <Box {...rest} __css={styles.box} ref={ref}>
            {children}
        </Box>
    );
});

export const AutocompleteItem = forwardRef<BoxProps & { children: ReactNode; variant: "default" | "active" }, "div">(function (
    { children, variant, ...rest },
    ref,
) {
    const styles = useMultiStyleConfig("Autocomplete", {variant});
    return (
        <Box {...rest} ref={ref} __css={styles.item}>
            {children}
        </Box>
    );
});
