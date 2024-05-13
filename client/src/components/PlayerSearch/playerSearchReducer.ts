import { Dispatch } from "react";
import { PlayerSearchHit } from "@/api/useApi";

export type PlayerSearchAction =
    | {
          name: "SEARCH_INPUT_CHANGED";
          value: string;
      }
    | {
          name: "SEARCH_HITS_RETURNED";
          hits: Array<PlayerSearchHit>;
      }
    | {
          name: "SEARCH_HIT_SELECTED";
          hit: PlayerSearchHit;
      };

export type PlayerSearchState = {
    hits: Array<PlayerSearchHit>;
    currentSearchTerm: string;
    redirectingTo: string | undefined;
};
export type PlayerSearchDispatch = Dispatch<PlayerSearchAction>;

export function playerSearchReducer(state: PlayerSearchState, action: PlayerSearchAction): PlayerSearchState {
    if (action.name === "SEARCH_INPUT_CHANGED") {
        return {
            ...state,
            currentSearchTerm: action.value.trim(),
        };
    }

    if (action.name === "SEARCH_HITS_RETURNED") {
        return {
            ...state,
            hits: action.hits,
        };
    }

    if (action.name === "SEARCH_HIT_SELECTED") {
        return {
            ...state,
            redirectingTo: action.hit.player ? `/player/${action.hit.player}` : undefined,
            hits: [],
        };
    }

    return state;
}
