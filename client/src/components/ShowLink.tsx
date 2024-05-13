import Link from "next/link";
import { shortShowTitle } from "@/domain/show/shortShowTitle";

export function ShowLink({ show, show_name, date }: { show: string; show_name: string; date: string }) {
    return (
        <Link title={show_name} href={`/show/${show}`}>
            {shortShowTitle({ show_name, date })}
        </Link>
    );
}
