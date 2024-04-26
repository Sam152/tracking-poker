import { Table, Tbody, Td, Tr } from "@chakra-ui/react";
import React, { ReactNode } from "react";

export function DataTable({ rows }: { rows: Array<Array<ReactNode>> | undefined }) {
    return (
        <Table>
            <Tbody>
                {rows &&
                    rows.map((row, i) => (
                        <Tr key={i}>
                            {row.map((column, j) => (
                                <Td key={j}>{column}</Td>
                            ))}
                        </Tr>
                    ))}
            </Tbody>
        </Table>
    );
}
