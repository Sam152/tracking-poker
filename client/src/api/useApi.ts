import useSWR, { SWRResponse } from "swr";

async function apiFetcher(input: string | URL | globalThis.Request, init?: RequestInit): Promise<any> {
    return fetch(`${process.env.NEXT_PUBLIC_INVENTORY_API}${input}`, init).then((res) => res.json());
}

export function useApi(endpoint: string) {
    return useSWR(endpoint, apiFetcher);
}

export function useShow(showId: string) {
    return useApi(`shows/${showId}`);
}

export function useShows() {
    return useApi(`shows`);
}

export function useWinnersLeaderboard(): SWRResponse<
    {
        playerName: string;
        playerId: string;
        statValue: number;
        dataPoints: number;
    }[]
> {
    return useApi(`leaderboards/winning`);
}
