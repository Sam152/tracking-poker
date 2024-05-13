import { Text } from "@chakra-ui/react";
import { formatMoney } from "@/util/formatMoney";

enum StatType {
    Good = "green.400",
    Neutral = "white",
    Bad = "red.400",
}

function Stat({ value, type }: { value: number | string; type: StatType }) {
    return <Text color={type}>{value}</Text>;
}

export function CwStat({ value }: { value: number }) {
    return <Stat value={formatMoney(value)} type={value < 0 ? StatType.Bad : StatType.Good} />;
}

export function VpipStat({ value }: { value: number }) {
    return <Stat value={Math.round(value)} type={StatType.Neutral} />;
}

export function PfrStat({ value }: { value: number }) {
    return <Stat value={Math.round(value)} type={StatType.Neutral} />;
}

export function StatFromType({ type, value }: { type: "cw" | "pfr" | "vpip"; value: number }) {
    if (type === "cw") {
        return <CwStat value={value} />;
    }
    if (type === "pfr") {
        return <PfrStat value={value} />;
    }
    if (type === "vpip") {
        return <VpipStat value={value} />;
    }
}

export function MissingStat() {
    return <>?</>;
}
