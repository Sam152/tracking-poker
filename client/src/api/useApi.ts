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

export function useShow(showId?: string) {
    return useApi(showId ? `shows/${showId}` : null);
}

export function usePlayer(playerId: string) {
    return useApi(`players/${playerId}`);
}

export function useShows(): SWRResponse<
    Array<{
        date: string;
        duration: number;
        id: string;
        operator: string;
        show_name: string;
    }>
> {
    return useApi(`shows`);
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
