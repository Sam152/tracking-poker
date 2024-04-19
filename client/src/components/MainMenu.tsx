import { Tab, TabList, Tabs } from "@chakra-ui/tabs";
import Link from "next/link";
import { useRouter } from "next/router";

export default function MainMenu() {
    const router = useRouter();

    const menuItems: Record<string, string> = {
        "/": "Top winning",
        "/not-so-winning": "Not so winning",
        "/highest-vpip": "Highest VPIP",
        "/lowest-vpip": "Lowest VPIP",
        "/shows": "Shows",
    };

    return (
        <Tabs index={Object.keys(menuItems).indexOf(router.pathname)}>
            <TabList>
                {Object.keys(menuItems).map((href, i) => (
                    <Tab as={Link} href={href} key={i}>
                        {menuItems[href]}
                    </Tab>
                ))}
            </TabList>
        </Tabs>
    );
}
