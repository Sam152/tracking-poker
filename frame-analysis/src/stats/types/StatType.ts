import { TextractDocument } from "amazon-textract-response-parser";

export enum StatType {
    ChipCount = "cc",
    CumulativeWinnings = "cw",
    PreflopRaise = "pfr",
    VPIP = "vpip",
}

export type PlayerStatCollection<TStat extends string | number> = Array<
    PlayerStat<TStat>
>;

export type PlayerStat<TStat extends string | number> = {
    playerName: string;
    stat: TStat;
};

export type StatMetadata = {
    type: StatType;

    /**
     * The word that should be detected using cheap (but inaccurate) OCR,
     * before triggering more expensive Textract OCR.
     *
     * Phrases in a single string like "FOO BAR", indicate both FOO and BAR
     * are required to have some degree of representation in the document.
     *
     * Phrases within the array are only required to match a single time,
     * for example ["FOO", "BAR"] would match if either was represented
     * in the document.
     */
    triggerWords: string[];

    /**
     * Get the stats from a given document.
     */
    getStatsFromDocument: (
        extract: TextractDocument,
        frame: Buffer,
    ) => Promise<PlayerStatCollection<number> | undefined>;
};
