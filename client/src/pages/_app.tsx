import type { AppProps } from "next/app";
import { ChakraBaseProvider, Container } from "@chakra-ui/react";
import { theme } from "@/theme/theme";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ChakraBaseProvider theme={theme}>
            <Container>
                <Component {...pageProps} />
            </Container>
        </ChakraBaseProvider>
    );
}
