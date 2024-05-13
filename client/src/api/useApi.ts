import useSWR, { SWRResponse } from "swr";

async function apiFetcher(input: string | URL | globalThis.Request, init?: RequestInit): Promise<any> {
    return fetch(`${process.env.NEXT_PUBLIC_INVENTORY_API}${input}`, init).then((res) => res.json());
}

/**
 * Null endpoint will skip fetching.
 */
export function useApi(endpoint: string | null) {
    return useSWR(endpoint, apiFetcher);
}

export function useShow(showId?: string): SWRResponse<{
    show: Show;
    players: PlayerAppearance[];
    stats: StatsList;
}> {
    return useApi(showId ? `shows/${showId}` : null);
}

type Stat = {
    player: string;
    player_name: string;
    show: string;
    type: "cw" | "pfr" | "vpip";
    value: number;
};

type PlayerAppearance = {
    date: string;
    player: string;
    player_name: string;
    show: string;
    show_name: string;
};
type StatsList = {
    cc?: Stat[];
    cw?: Stat[];
    pfr?: Stat[];
    vpip?: Stat[];
};
export function usePlayer(playerId?: string): SWRResponse<{
    appearances: Array<PlayerAppearance>;
    stats: StatsList;
}> {
    return useApi(`players/${playerId}`);
}

export type Show = {
    date: string;
    duration: number;
    id: string;
    operator: string;
    show_name: string;
};
export function useShows(): SWRResponse<Array<Show>> {
    return useApi(`shows`);
}

export type PlayerSearchHit = {
    player: string;
    player_name: string;
    last_played_date: string;
    last_played_show: string;
};
export function usePlayerSearch(term: string): Promise<{ hits: Array<PlayerSearchHit> }> {
    return apiFetcher(`search/players/${term}`);
}

type LeaderboardResponse = SWRResponse<
    Array<{
        playerName: string;
        playerId: string;
        statValue: number;
        dataPoints: number;
    }>
>;

export function useWinnersLeaderboard(): LeaderboardResponse {
    return useApi(`leaderboards/winning`);
}

export function useNotSoWinningLeaderboard(): LeaderboardResponse {
    return useApi(`leaderboards/not-so-winning`);
}

export function useHighestVpipLeaderboard(): LeaderboardResponse {
    return useApi(`leaderboards/highest-vpip`);
}

export function useLowestVpipLeaderboard(): LeaderboardResponse {
    return useApi(`leaderboards/lowest-vpip`);
}
