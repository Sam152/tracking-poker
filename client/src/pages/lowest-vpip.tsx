import MainMenu from "@/components/MainMenu";
import { useLowestVpipLeaderboard } from "@/api/useApi";
import { DataTable } from "@/components/DataTable";
import { PlayerLink } from "@/components/PlayerLink";
import { VpipStat } from "@/components/Stat";
import { HeadingOne } from "@/components/HeadingOne";
import { PageTitle } from "@/components/PageTitle";

export default function HighestVpip() {
    const items = useLowestVpipLeaderboard();
    return (
        <>
            <HeadingOne>Leaderboards</HeadingOne>
            <PageTitle title={"Lowest VPIP"} />
            <MainMenu />
            <DataTable rows={items.data?.map((item) => [<PlayerLink {...item} />, <VpipStat value={item.statValue} />])} />
        </>
    );
}
