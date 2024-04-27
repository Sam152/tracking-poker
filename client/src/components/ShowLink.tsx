import Link from "next/link";

export function ShowLink({ show, show_name, date }: { show: string; show_name: string; date: string }) {
    return <Link href={`/show/${show}`}>{show_name}</Link>;
}
