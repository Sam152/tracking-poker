import Head from "next/head";

export function PageTitle({ title }: { title?: string }) {
    return <Head>{title && <title>{title} | Tracking Poker</title>}</Head>;
}
