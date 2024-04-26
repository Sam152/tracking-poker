import { NextRouter, useRouter } from "next/router";

type TypedRouterReturn<Query> = NextRouter & {
    query: Partial<Query>;
};

export function useTypedRouter<Query>(): TypedRouterReturn<Query> {
    return useRouter() as TypedRouterReturn<Query>;
}
