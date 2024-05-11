import MainMenu from "@/components/MainMenu";
import { useNotSoWinningLeaderboard } from "@/api/useApi";
import { DataTable } from "@/components/DataTable";
import { PlayerLink } from "@/components/PlayerLink";
import { CwStat } from "@/components/Stat";
import { HeadingOne } from "@/components/HeadingOne";
import { PageTitle } from "@/components/PageTitle";

export default function NotSoWinning() {
    const items = useNotSoWinningLeaderboard();

    return (
        <>
            <HeadingOne>Leaderboards</HeadingOne>
            <PageTitle title={"Not so winning"} />
            <MainMenu />
            <DataTable rows={items.data?.map((item) => [<PlayerLink {...item} />, <CwStat value={item.statValue} />])} />
        </>
    );
}
