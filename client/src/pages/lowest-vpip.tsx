import MainMenu from "@/components/MainMenu";
import { useLowestVpipLeaderboard } from "@/api/useApi";
import { DataTable } from "@/components/DataTable";
import { PlayerLink } from "@/components/PlayerLink";
import { VpipStat } from "@/components/Stat";
import { HeadingOne } from "@/components/HeadingOne";
import { PageElementStack } from "@/components/PageElementStack";

export default function HighestVpip() {
    const items = useLowestVpipLeaderboard();
    return (
        <PageElementStack pageTitle={"Lowest VPIP"}>
            <HeadingOne>Leaderboards</HeadingOne>
            <MainMenu />
            <DataTable rows={items.data?.map((item) => [<PlayerLink {...item} />, <VpipStat value={item.statValue} />])} />
        </PageElementStack>
    );
}
