import { SWRResponse } from "swr";
import { Code } from "@chakra-ui/react";

export function QueryDebug({ query }: { query: SWRResponse<any> }) {
    return (
        <Code>
            <pre>{JSON.stringify(query.data, null, 2)}</pre>
        </Code>
    );
}
