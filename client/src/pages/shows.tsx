import { useShows } from "@/api/useApi";
import MainMenu from "@/components/MainMenu";
import { DataTable } from "@/components/DataTable";
import { HeadingOne } from "@/components/HeadingOne";
import { PageTitle } from "@/components/PageTitle";
import { ShowLink } from "@/components/ShowLink";
import { formatDate } from "@/util/formatDate";

export default function Shows() {
    const items = useShows();
    return (
        <>
            <HeadingOne>Leaderboards</HeadingOne>
            <PageTitle title={"Highest VPIP"} />
            <MainMenu />
            <DataTable
                rows={items.data?.map((item) => [
                    <ShowLink show={item.id} show_name={item.show_name} date={item.date} />,
                    formatDate(item.date),
                ])}
            />
        </>
    );
}
