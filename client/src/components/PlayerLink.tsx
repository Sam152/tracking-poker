import Link from "next/link";

export function PlayerLink({ playerName, playerId }: { playerName: string; playerId: string }) {
    return <Link href={`/player/${playerId}`}>{playerName}</Link>;
}
