import { Heading, Skeleton } from "@chakra-ui/react";
import { ReactNode } from "react";

export function HeadingOne({ children, loading = false }: { children?: ReactNode; loading?: boolean }) {
    return (
        <>
            <Heading as="h1" size="2xl">
                {loading ? <Skeleton w="375px" h="48px" /> : children}
            </Heading>
        </>
    );
}
