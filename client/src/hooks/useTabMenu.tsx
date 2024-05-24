import { ReactElement, ReactNode, useState } from "react";
import { Tab, TabList, Tabs } from "@chakra-ui/tabs";
import { Skeleton } from "@chakra-ui/react";

function TabMenu({
    items,
    activeItem,
    setActiveItem,
}: {
    items: Record<string, ReactNode>;
    activeItem: string;
    setActiveItem: (key: string) => void;
}) {
    return (
        <Tabs index={Object.keys(items).indexOf(activeItem)}>
            <TabList>
                {Object.keys(items).map((key, i) => (
                    <Tab key={i} onClick={() => setActiveItem(key)}>
                        {items[key]}
                    </Tab>
                ))}
            </TabList>
        </Tabs>
    );
}

export function useTabMenu<TItems extends Record<string, string>>(items: TItems): [keyof TItems, ReactElement] {
    const [activeItem, setActiveItem] = useState<string>(Object.keys(items)[0]);
    return [activeItem, <TabMenu setActiveItem={setActiveItem} activeItem={activeItem} items={items} />];
}

export function TabMenuSkeleton() {
    return (
        <TabMenu
            setActiveItem={() => null}
            activeItem={"a"}
            items={{
                a: <Skeleton w="160px" h="24px" display="block" />,
                b: <Skeleton w="80px" h="24px" display="block" />,
                c: <Skeleton w="80px" h="24px" display="block" />,
                d: <Skeleton w="80px" h="24px" display="block" />,
            }}
        />
    );
}
