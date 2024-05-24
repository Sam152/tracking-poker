import { useShows } from "@/api/useApi";
import MainMenu from "@/components/MainMenu";
import { DataTable } from "@/components/DataTable";
import { HeadingOne } from "@/components/HeadingOne";
import { ShowLink } from "@/components/ShowLink";
import { formatDate } from "@/util/formatDate";
import { PageElementStack } from "@/components/PageElementStack";
import { useDebugMode } from "@/hooks/useDebugMode";
import { DebugLinks } from "@/components/debug/DebugLinks";
import { debugLinks } from "@/domain/aws/debugLinks";

export default function Shows() {
    const items = useShows();
    const debug = useDebugMode();

    return (
        <PageElementStack pageTitle={"Highest VPIP"}>
            <HeadingOne>Leaderboards</HeadingOne>
            <MainMenu />

            {debug && (
                <DebugLinks
                    links={{
                        "Dispatch new show": debugLinks.pipelineLambda(),
                        "X-Ray trace map": debugLinks.traceMap(),
                        "7 day cost report": debugLinks.costReport(),
                    }}
                />
            )}

            <DataTable
                rows={items.data?.map((item) => [
                    <ShowLink show={item.id} show_name={item.show_name} date={item.date} />,
                    formatDate(item.date),
                ])}
            />
        </PageElementStack>
    );
}
