import {HeadingOne} from "@/components/HeadingOne";
import {DataTable} from "@/components/DataTable";
import React from "react";
import {TabMenuSkeleton} from "@/hooks/useTabMenu";
import {PageElementStack} from "@/components/PageElementStack";

/**
 * Skeleton of a typical page in the format of a heading, menu and data table.
 */
export function PageSkeleton() {
    return (
        <PageElementStack pageTitle={"Loading"}>
            <HeadingOne loading={true} />
            <TabMenuSkeleton />
            <DataTable rows={undefined} />
        </PageElementStack>
    );
}
