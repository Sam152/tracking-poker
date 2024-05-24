import React from "react";
import { usePlayer } from "@/api/useApi";
import { useTypedRouter } from "@/hooks/useTypedRouter";
import { DataTable } from "@/components/DataTable";
import { ShowLink } from "@/components/ShowLink";
import { MissingStat, StatFromType } from "@/components/Stat";
import { useTabMenu } from "@/hooks/useTabMenu";
import { HeadingOne } from "@/components/HeadingOne";
import { PageElementStack } from "@/components/PageElementStack";
import { useDebugMode } from "@/hooks/useDebugMode";
import { QueryDebug } from "@/components/debug/QueryDebug";
import { RenderQuery } from "@/components/PageFromQuery";

export default function PlayerPage() {
    const router = useTypedRouter<{ id: string }>();
    const player = usePlayer(router.query.id);
    const debug = useDebugMode();

    const [activeTab, tabs] = useTabMenu({
        cw: "Cumulative winnings",
        vpip: "VPIP",
        pfr: "Pre-flop raise",
    });

    return (
        <RenderQuery query={player}>
            {(data) => (
                <PageElementStack pageTitle={data.appearances[0]?.player_name}>
                    <HeadingOne>{data.appearances[0]?.player_name}</HeadingOne>
                    {tabs}
                    <DataTable
                        rows={data.appearances.map((appearance) => {
                            const stat = data.stats[activeTab]?.find((stat) => stat.show === appearance.show);
                            return [
                                <ShowLink {...appearance} />,
                                stat ? <StatFromType type={stat.type} value={stat.value} /> : <MissingStat />,
                            ];
                        })}
                    />

                    {debug && (
                        <>
                            <QueryDebug query={player} />
                        </>
                    )}
                </PageElementStack>
            )}
        </RenderQuery>
    );
}
