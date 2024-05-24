import { ReactNode } from "react";
import { VStack } from "@chakra-ui/layout";
import { PageTitle } from "@/components/PageTitle";

export function PageElementStack({ children, pageTitle }: { children?: ReactNode; pageTitle?: string }) {
    return (
        <>
            {pageTitle && <PageTitle title={"Not so winning"} />}
            <VStack w="full" alignItems="stretch" spacing={6} pb={12}>
                {children}
            </VStack>
        </>
    );
}
