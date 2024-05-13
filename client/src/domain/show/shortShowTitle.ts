import { Show } from "@/api/useApi";
import { dayOfTheWeek } from "@/util/dayOfTheWeek";
import { extractStakes, stakesMatch } from "@/domain/show/extractStakes";
import { stringFromParts } from "@/util/conditionalString";

const gameTypes: Array<{ match: RegExp; formatter: (show: Pick<Show, "show_name" | "date">, date: Date) => string }> = [
    {
        match: /ante game/i,
        formatter: (show, date) => stringFromParts([dayOfTheWeek(date), extractStakes(show.show_name), "Ante Game"]),
    },
    {
        match: /max pain/i,
        formatter: () => "Max Pain Monday",
    },
    {
        match: /plo|pot limit/i,
        formatter: (show) => stringFromParts([extractStakes(show.show_name), "Pot Limit Omaha"]),
    },
    {
        match: /bounty game/i,
        formatter: () => "The Bounty Game",
    },
    {
        match: /thirsty thursds?ay/i,
        formatter: () => "Thirsty Thursday",
    },
    {
        match: /super high stakes/i,
        formatter: (show) => stringFromParts([extractStakes(show.show_name), "Super High Stakes"]),
    },
    {
        match: /high stakes/i,
        formatter: (show, date) => stringFromParts([extractStakes(show.show_name), dayOfTheWeek(date), "High Stakes"]),
    },
    {
        match: /million dollar game|\$1 MILLION BUYIN/i,
        formatter: (show, date) => "Million Dollar Game",
    },
    {
        match: /creator poker night|MrBEAST/i,
        formatter: (show, date) => stringFromParts([extractStakes(show.show_name), "Creator Game"]),
    },
    {
        match: /Celebrity Poker Game/i,
        formatter: (show, date) => stringFromParts([extractStakes(show.show_name), "Celebrity Game"]),
    },
    {
        match: /ALL-STAR GAME/i,
        formatter: () => "All Star Game",
    },
    {
        match: /24-HOUR STREAM/i,
        formatter: () => "24 Hour Stream",
    },
    {
        match: /pre-game/i,
        formatter: () => "Pre-game Show",
    },
    {
        match: stakesMatch,
        formatter: (show, date) => [dayOfTheWeek(date), extractStakes(show.show_name)].join(" "),
    },
];

export function shortShowTitle(show: Pick<Show, "show_name" | "date">): string {
    const gameType = gameTypes.find((type) => type.match.test(show.show_name));
    const date = new Date(Date.parse(show.date));
    return gameType?.formatter(show, date) || `${dayOfTheWeek(date)} Game`;
}
