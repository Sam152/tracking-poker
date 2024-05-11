import { useShows } from "@/api/useApi";
import MainMenu from "@/components/MainMenu";
import { DataTable } from "@/components/DataTable";
import Link from "next/link";
import { HeadingOne } from "@/components/HeadingOne";
import { PageTitle } from "@/components/PageTitle";

export default function Shows() {
    const items = useShows();
    return (
        <>
            <HeadingOne>Leaderboards</HeadingOne>
            <PageTitle title={"Highest VPIP"} />
            <MainMenu />
            <DataTable rows={items.data?.map((item) => [<Link href={`/show/${item.id}`}>{item.show_name}</Link>])} />
        </>
    );
}
