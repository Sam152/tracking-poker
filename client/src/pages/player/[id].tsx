import React from "react";
import { usePlayer } from "@/api/useApi";
import { useTypedRouter } from "@/hooks/useTypedRouter";
import { DataTable } from "@/components/DataTable";
import { ShowLink } from "@/components/ShowLink";
import { MissingStat, StatFromType } from "@/components/Stat";
import { useTabMenu } from "@/hooks/useTabMenu";
import { HeadingOne } from "@/components/HeadingOne";
import { PageTitle } from "@/components/PageTitle";

export default function PlayerPage() {
    const router = useTypedRouter<{ id: string }>();
    const player = usePlayer(router.query.id);

    const [activeTab, tabs] = useTabMenu({
        cw: "Cumulative winnings",
        vpip: "VPIP",
        pfr: "Pre-flop raise",
    });

    return (
        <>
            <HeadingOne loading={player.isLoading}>{player.data?.appearances[0]?.player_name}</HeadingOne>
            <PageTitle title={"Highest VPIP"} />

            {tabs}
            <DataTable
                rows={player.data?.appearances.map((appearance) => {
                    const stat = player.data?.stats[activeTab]?.find((stat) => stat.show === appearance.show);
                    return [
                        <ShowLink {...appearance} />,
                        stat ? <StatFromType type={stat.type} value={stat.value} /> : <MissingStat />,
                    ];
                })}
            />
        </>
    );
}
