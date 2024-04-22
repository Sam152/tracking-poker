import MainMenu from "@/components/MainMenu";
import { useWinnersLeaderboard } from "@/api/useApi";
import { Table, Tbody, Td, Tr } from "@chakra-ui/react";
import { DataPoint } from "@/components/Stat";

export default function Home() {
    const items = useWinnersLeaderboard();

    return (
        <>
            <MainMenu />

            <Table>
                <Tbody>
                    {items.data &&
                        items.data.map((item) => (
                            <Tr>
                                <Td>{item.playerName}</Td>
                                <Td>
                                    <DataPoint value={item.statValue} />
                                </Td>
                            </Tr>
                        ))}
                </Tbody>
            </Table>
        </>
    );
}
