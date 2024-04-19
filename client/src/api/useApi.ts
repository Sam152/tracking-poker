import useSWR from "swr";

async function apiFetcher(input: string | URL | globalThis.Request, init?: RequestInit): Promise<any> {
    return fetch(`${process.env.NEXT_PUBLIC_INVENTORY_API}/${input}`, init).then((res) => res.json());
}

export function useApi(endpoint: string) {
    return useSWR(endpoint, apiFetcher);
}

export function useShow(showId: string) {
    return useApi(`shows/${showId}`);
}
