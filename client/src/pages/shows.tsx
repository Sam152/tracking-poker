import { useShows } from "@/api/useApi";
import MainMenu from "@/components/MainMenu";
import { DataTable } from "@/components/DataTable";
import Link from "next/link";

export default function Shows() {
    const items = useShows();
    return (
        <>
            <MainMenu />
            <DataTable rows={items.data?.map((item) => [<Link href={`/show/${item.id}`}>{item.show_name}</Link>])} />
        </>
    );
}
