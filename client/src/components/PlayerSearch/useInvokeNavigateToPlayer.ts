import { PlayerSearchState } from "@/components/PlayerSearch/playerSearchReducer";
import { useEffect } from "react";
import { useRouter } from "next/router";

export function useInvokeNavigateToPlayer(state: PlayerSearchState) {
    const router = useRouter();

    useEffect(() => {
        if (state.redirectingTo) {
            router.push(state.redirectingTo);
        }
    }, [state.redirectingTo]);
}
