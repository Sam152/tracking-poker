import { Head, Html, Main, NextScript } from "next/document";
import { ColorModeScript } from "@chakra-ui/react";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="shortcut icon" href="/favicon.png" />
            </Head>
            <body>
                <ColorModeScript initialColorMode={"dark"} type={"localStorage"} />
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
