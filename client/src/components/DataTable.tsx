import { Skeleton, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { fill } from "@/util/fill";

export function DataTable({ rows }: { rows: Array<Array<ReactNode>> | undefined }) {
    if (!rows) {
        return <TableSkeleton />;
    }
    return (
        <Table>
            <Tbody>
                {rows.map((row, i) => (
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

function TableSkeleton() {
    return (
        <Table>
            <Tbody>
                {fill(8).map((v, i) => (
                    <Tr key={i}>
                        <Td>
                            <Skeleton w="260px" h="19px" />
                        </Td>
                        <Td>
                            <Skeleton w="260px" h="19px" />
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
}
