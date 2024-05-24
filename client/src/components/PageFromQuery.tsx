import { ReactNode } from "react";
import { SWRResponse } from "swr";
import { PageSkeleton } from "@/components/PageSkeleton";

export function RenderQuery<T>({
    children,
    query,
    skeleton = undefined,
}: {
    children: (data: T) => ReactNode;
    query: SWRResponse<T>;
    skeleton?: ReactNode;
}) {
    return !query.data ? skeleton || <PageSkeleton /> : children(query.data);
}
