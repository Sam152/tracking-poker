import type { AppProps } from "next/app";
import { Box, ChakraBaseProvider, Container, HStack, Input } from "@chakra-ui/react";
import { theme } from "@/theme/theme";
import Link from "next/link";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ChakraBaseProvider theme={theme}>
            <Container>
                <HStack w="full" justifyContent="space-between" py={12}>
                    <Box>
                        <HStack as={Link} href={"/"} textStyle="logo" spacing={3}>
                            <svg
                                stroke="currentColor"
                                fill="currentColor"
                                stroke-width="0"
                                viewBox="0 0 576 512"
                                height="30px"
                                width="30px"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M384 160c-17.7 0-32-14.3-32-32s14.3-32 32-32H544c17.7 0 32 14.3 32 32V288c0 17.7-14.3 32-32 32s-32-14.3-32-32V205.3L342.6 374.6c-12.5 12.5-32.8 12.5-45.3 0L192 269.3 54.6 406.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160c12.5-12.5 32.8-12.5 45.3 0L320 306.7 466.7 160H384z"></path>
                            </svg>
                            <span>Tracking Poker</span>
                        </HStack>
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
