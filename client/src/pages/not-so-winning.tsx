import MainMenu from "@/components/MainMenu";
import { useNotSoWinningLeaderboard } from "@/api/useApi";
import { DataTable } from "@/components/DataTable";
import { PlayerLink } from "@/components/PlayerLink";
import { CwStat } from "@/components/Stat";
import { HeadingOne } from "@/components/HeadingOne";
import { PageElementStack } from "@/components/PageElementStack";

export default function NotSoWinning() {
    const items = useNotSoWinningLeaderboard();

    return (
        <PageElementStack pageTitle={"Not so winning"}>
            <HeadingOne>Leaderboards</HeadingOne>
            <MainMenu />
            <DataTable rows={items.data?.map((item) => [<PlayerLink {...item} />, <CwStat value={item.statValue} />])} />
        </PageElementStack>
    );
}
