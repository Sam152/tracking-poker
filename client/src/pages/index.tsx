import MainMenu from "@/components/MainMenu";
import { useWinnersLeaderboard } from "@/api/useApi";
import { DataTable } from "@/components/DataTable";
import { PlayerLink } from "@/components/PlayerLink";
import { CwStat } from "@/components/Stat";
import { HeadingOne } from "@/components/HeadingOne";
import { PageTitle } from "@/components/PageTitle";

export default function Home() {
    const items = useWinnersLeaderboard();

    return (
        <>
            <HeadingOne>Leaderboards</HeadingOne>
            <PageTitle title={"Top Winning"} />
            <MainMenu />
            <DataTable rows={items.data?.map((item) => [<PlayerLink {...item} />, <CwStat value={item.statValue} />])} />
        </>
    );
}
