import MainMenu from "@/components/MainMenu";
import { useWinnersLeaderboard } from "@/api/useApi";
import { DataPoint } from "@/components/Stat";
import { DataTable } from "@/components/DataTable";

export default function Home() {
    const items = useWinnersLeaderboard();

    return (
        <>
            <MainMenu />
            <DataTable rows={items.data?.map((item) => [item.playerName, <DataPoint value={item.statValue} />])} />
        </>
    );
}
