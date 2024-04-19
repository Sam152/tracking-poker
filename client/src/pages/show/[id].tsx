import { useRouter } from "next/router";
import React from "react";

export default function ShowPage() {
    const router = useRouter();
    return (
        <div>
            <h1>Show ID: {router.query.id}</h1>
        </div>
    );
}
