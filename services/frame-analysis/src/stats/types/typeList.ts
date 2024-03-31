import {ChipCount} from "./ChipCount";
import {CumulativeWinnings} from "./CumulativeWinnings";
import {PreflopRaise} from "./PreflopRaise";
import {VPIP} from "./VPIP";
import {StatMetadata, StatType} from "./StatType";

export const typeCollection: Record<StatType, StatMetadata> = {
    [StatType.ChipCount]: ChipCount,
    [StatType.CumulativeWinnings]: CumulativeWinnings,
    [StatType.PreflopRaise]: PreflopRaise,
    [StatType.VPIP]: VPIP,
};

export const typeList = [
    ChipCount,
    CumulativeWinnings,
    PreflopRaise,
    VPIP,
];
