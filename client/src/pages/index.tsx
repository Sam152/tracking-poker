import MainMenu from "@/components/MainMenu";
import { useWinnersLeaderboard } from "@/api/useApi";
import { DataTable } from "@/components/DataTable";
import { PlayerLink } from "@/components/PlayerLink";
import { CwStat } from "@/components/Stat";

export default function Home() {
    const items = useWinnersLeaderboard();

    return (
        <>
            <MainMenu />
            <DataTable rows={items.data?.map((item) => [<PlayerLink {...item} />, <CwStat value={item.statValue} />])} />
        </>
    );
}
