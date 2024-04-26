import React from "react";
import { useShow } from "@/api/useApi";
import { useTypedRouter } from "@/hooks/useTypedRouter";
import { useTabMenu } from "@/hooks/useTabMenu";

export default function ShowPage() {
    const router = useTypedRouter<{ id: string }>();
    const show = useShow(router.query.id);

    const [activeTab, tabs] = useTabMenu({
        cw: "Cumulative winnings",
        vpip: "VPIP",
        pfr: "Pre-flop raise",
    });

    return <div>{tabs}</div>;
}
