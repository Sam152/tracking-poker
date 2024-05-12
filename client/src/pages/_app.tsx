import type { AppProps } from "next/app";
import { Box, ChakraBaseProvider, Container, HStack, Input } from "@chakra-ui/react";
import { theme } from "@/theme/theme";
import { Logo } from "@/components/Logo";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ChakraBaseProvider theme={theme}>
            <Container>
                <HStack w="full" justifyContent="space-between" py={12}>
                    <Box>
                        <Logo />
                    </Box>
                    <Box>
                        <Input placeholder="Search for a player..."></Input>
                    </Box>
                </HStack>
            </Container>

            <Container>
                <Component {...pageProps} />
            </Container>
        </ChakraBaseProvider>
    );
}
