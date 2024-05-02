import React from "react";
import { useShow } from "@/api/useApi";
import { useTypedRouter } from "@/hooks/useTypedRouter";
import { useTabMenu } from "@/hooks/useTabMenu";
import { DataTable } from "@/components/DataTable";
import { PlayerLink } from "@/components/PlayerLink";
import { MissingStat, StatFromType } from "@/components/Stat";

export default function ShowPage() {
    const router = useTypedRouter<{ id: string }>();
    const show = useShow(router.query.id);

    const [activeTab, tabs] = useTabMenu({
        cw: "Cumulative winnings",
        vpip: "VPIP",
        pfr: "Pre-flop raise",
    });

    return (
        <>
            {tabs}
            <DataTable
                rows={show.data?.players
                    .sort((a, b) => {
                        const statA = show.data?.stats[activeTab]?.find((stat) => stat.player === a.player)?.value || -99999999;
                        const statB = show.data?.stats[activeTab]?.find((stat) => stat.player === b.player)?.value || -99999999;
                        return statB - statA;
                    })
                    .map((player) => {
                        const stat = show.data?.stats[activeTab]?.find((stat) => stat.player === player.player);
                        return [
                            <PlayerLink playerName={player.player_name} playerId={player.player} />,
                            stat ? <StatFromType type={activeTab} value={stat.value} /> : <MissingStat />,
                        ];
                    })}
            />
        </>
    );
}
