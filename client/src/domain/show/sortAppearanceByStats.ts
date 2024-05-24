import { PlayerAppearance, Stat } from "@/api/useApi";

export function sortAppearanceByStats(stats?: Stat[]) {
    return (a: PlayerAppearance, b: PlayerAppearance) => {
        const statA = stats?.find((stat) => stat.player === a.player)?.value || -99999999;
        const statB = stats?.find((stat) => stat.player === b.player)?.value || -99999999;
        return statB - statA;
    };
}
