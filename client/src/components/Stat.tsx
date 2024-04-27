import { Text } from "@chakra-ui/react";

function Stat({ value }: { value: number }) {
    return <Text color="green.100">{Math.round(value)}</Text>;
}

export function CwStat({ value }: { value: number }) {
    return <Stat value={value} />;
}

export function VpipStat({ value }: { value: number }) {
    return <Stat value={value} />;
}

export function PfrStat({ value }: { value: number }) {
    return <Stat value={value} />;
}

export function StatFromType({type, value}: {type: "cw" | "pfr" | "vpip", value: number}) {
    if (type === "cw") {
        return <CwStat value={value} />
    }
    if (type === "pfr") {
        return <PfrStat value={value} />
    }
    if (type === "vpip") {
        return <VpipStat value={value} />
    }
}

export function MissingStat() {
    return <>?</>;
}
