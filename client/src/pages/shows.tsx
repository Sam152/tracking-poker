import { useShows } from "@/api/useApi";
import MainMenu from "@/components/MainMenu";
import { DataTable } from "@/components/DataTable";
import Link from "next/link";

export default function Shows() {
    const items = useShows();
    console.log(items.data);

    return (
        <>
            <MainMenu />
            <DataTable rows={items.data?.map((item) => [<Link href={`/shows/${item.id}`}>{item.show_name}</Link>])} />
        </>
    );
}
