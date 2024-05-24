import { Code } from "@chakra-ui/react";
import Link from "next/link";
import { VStack } from "@chakra-ui/layout";

export function DebugLinks({ links }: { links: Record<string, string> }) {
    return (
        <Code>
            <VStack w="full" alignItems="flex-start">
                {Object.keys(links).map((linkTitle) => (
                    <Link href={links[linkTitle]} target="_blank">
                        {linkTitle}
                    </Link>
                ))}
            </VStack>
        </Code>
    );
}
