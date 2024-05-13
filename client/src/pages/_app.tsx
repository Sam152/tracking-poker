import type { AppProps } from "next/app";
import { Box, ChakraBaseProvider, Container, HStack } from "@chakra-ui/react";
import { theme } from "@/theme/theme";
import { Logo } from "@/components/Logo";
import { PlayerSearch } from "@/components/PlayerSearch";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ChakraBaseProvider theme={theme}>
            <Container>
                <HStack w="full" justifyContent="space-between" py={12}>
                    <Box>
                        <Logo />
                    </Box>
                    <Box>
                        <PlayerSearch />
                    </Box>
                </HStack>
            </Container>
            <Container>
                <Component {...pageProps} />
            </Container>
        </ChakraBaseProvider>
    );
}
