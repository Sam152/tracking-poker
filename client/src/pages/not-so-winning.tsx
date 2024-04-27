import MainMenu from "@/components/MainMenu";
import { useNotSoWinningLeaderboard } from "@/api/useApi";
import { DataTable } from "@/components/DataTable";
import { PlayerLink } from "@/components/PlayerLink";
import { CwStat } from "@/components/Stat";

export default function NotSoWinning() {
    const items = useNotSoWinningLeaderboard();

    return (
        <>
            <MainMenu />
            <DataTable rows={items.data?.map((item) => [<PlayerLink {...item} />, <CwStat value={item.statValue} />])} />
        </>
    );
}
