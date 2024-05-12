import Head from "next/head";

export function PageTitle({ title }: { title?: string }) {
    const fullTitle = title ? `${title} | Tracking Poker` : "Loading...";

    return (
        <Head>
            <title>{fullTitle}</title>
        </Head>
    );
}
