import NodeCache from "node-cache";
import { executeQuery } from "../../dynamo/executeQuery";
import { allPlayers } from "../../projection/queries/allPlayers";
import * as fuzzySearch from "@m31coding/fuzzy-search";
import { Player } from "../../projection/entity/player";
import { DynamicSearcher } from "@m31coding/fuzzy-search/dist/interfaces/dynamic-searcher";

const cache = new NodeCache({
    stdTTL: 60 * 60,
    checkperiod: 0,
    useClones: false,
});

type Index = DynamicSearcher<Player, string>;

export async function playerSearchIndex(): Promise<Index> {
    const cacheHit = cache.get<Index>("index");
    if (cacheHit) {
        return cacheHit;
    }

    const { players } = await executeQuery(allPlayers());
    const index = fuzzySearch.SearcherFactory.createDefaultSearcher<Player, string>();

    index.indexEntities(
        players,
        (player) => player.player,
        (player) => [player.player_name],
    );
    cache.set("index", index);

    return index;
}

export async function searchPlayerIndex(searchTerm: string) {
    return (await playerSearchIndex()).getMatches(new fuzzySearch.Query(searchTerm)).matches.map((match) => match.entity);
}
