import {ChipCount} from "./ChipCount";
import {CumulativeWinnings} from "./CumulativeWinnings";
import {PreflopRaise} from "./PreflopRaise";
import {VPIP} from "./VPIP";

export const typeCollection = [
    new ChipCount(),
    new CumulativeWinnings(),
    new PreflopRaise(),
    new VPIP(),
];

export type PlayerStat<TStat extends string|number> = {
    playerName: string,
    stat: TStat,
}

export type PlayerStatCollection<TStat extends string|number> = Array<PlayerStat<TStat>>;
