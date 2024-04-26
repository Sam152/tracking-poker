import { useState } from "react";
import { Tab, TabList, Tabs } from "@chakra-ui/tabs";

function TabMenu({
    items,
    activeItem,
    setActiveItem,
}: {
    items: Record<string, string>;
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

export function useTabMenu(items: Record<string, string>) {
    const [activeItem, setActiveItem] = useState<string>(Object.keys(items)[0]);
    return [activeItem, <TabMenu setActiveItem={setActiveItem} activeItem={activeItem} items={items} />];
}
