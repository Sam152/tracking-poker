import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {isDynamicRoute} from "next/dist/shared/lib/router/utils";
import {getRouteRegex} from "next/dist/shared/lib/router/utils/route-regex";
import {getClientBuildManifest} from "next/dist/client/route-loader";

/**
 * This custom 404 page allows next apps with output => export to be hosted on S3 buckets, where files may not actually
 * exist for dynamic routes.
 *
 * @see https://github.com/vercel/next.js/discussions/17711
 * @see https://github.com/gowth6m/deploy-nextjs-s3
 */
export default function Custom404() {
    const router = useRouter();

    const [isLegitimate404, setIsLegitimate404] = useState(false);
    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        pageExists(router.asPath).then((exists) => {
            if (exists) {
                router.replace(router.asPath);
            } else {
                setIsLegitimate404(true);
            }
        });
    }, [router.isReady, router.asPath, router]);

    // In this state, we are in the process of determining if a given path is a route and will be redirected to.
    if (!isLegitimate404) {
        return <div>loading</div>;
    }

    return <div>Custom404</div>;
}

async function pageExists(location: string) {
    const { sortedPages } = await getClientBuildManifest();
    const pathname = location === "/" ? location : location.replace(/\/$/, "");
    return (
        sortedPages.includes(pathname) ||
        sortedPages.some((page) => {
            return isDynamicRoute(page) && getRouteRegex(page).re.test(pathname);
        })
    );
}
