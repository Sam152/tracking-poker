import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const outline = defineStyle({
    border: "2px solid",
    borderColor: "gray.900",
    borderRadius: 10,
    color: "gray.400",
    fontWeight: "normal",
    overflowX: "auto",
    p: 6,
});

export const codeTheme = defineStyleConfig({
    baseStyle: outline,
});
