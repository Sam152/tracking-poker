import React from "react";
import { useShow } from "@/api/useApi";
import { useTypedRouter } from "@/hooks/useTypedRouter";
import { useTabMenu } from "@/hooks/useTabMenu";
import { DataTable } from "@/components/DataTable";
import { PlayerLink } from "@/components/PlayerLink";
import { MissingStat, StatFromType } from "@/components/Stat";
import { HeadingOne } from "@/components/HeadingOne";
import { shortShowTitle } from "@/domain/show/shortShowTitle";
import { PageElementStack } from "@/components/PageElementStack";
import { QueryDebug } from "@/components/debug/QueryDebug";
import { useDebugMode } from "@/hooks/useDebugMode";
import { DebugLinks } from "@/components/debug/DebugLinks";
import { debugLinks } from "@/domain/aws/debugLinks";
import { IconButtonWithTooltip } from "@/components/IconButtonWithTooltip";
import { RxOpenInNewWindow } from "react-icons/rx";
import { PiYoutubeLogoLight } from "react-icons/pi";
import { AspectRatio, HStack, Text } from "@chakra-ui/react";
import { formatDate } from "@/util/formatDate";
import { VStack } from "@chakra-ui/layout";
import { useToggle } from "@/hooks/useToggle";
import { RenderQuery } from "@/components/PageFromQuery";
import { sortAppearanceByStats } from "@/domain/show/sortAppearanceByStats";

export default function ShowPage() {
    const router = useTypedRouter<{ id: string }>();
    const show = useShow(router.query.id);
    const debug = useDebugMode();
    const [showEmbed, toggleEmbed] = useToggle();

    const [activeTab, tabs] = useTabMenu({
        cw: "Cumulative winnings",
        vpip: "VPIP",
        pfr: "Pre-flop raise",
    });

    return (
        <RenderQuery query={show}>
            {(data) => (
                <PageElementStack pageTitle={shortShowTitle(data.show)}>
                    <VStack spacing={2} w="full" alignItems="flex-start">
                        <HStack justifyContent="space-between" w="full">
                            <HeadingOne>{shortShowTitle(data.show)}</HeadingOne>
                            <HStack>
                                <IconButtonWithTooltip
                                    tooltip={"Open on YouTube"}
                                    icon={<RxOpenInNewWindow size={"25px"} />}
                                    as={"a"}
                                    href={`https://www.youtube.com/watch?v=${data.show.id}`}
                                    target="_blank"
                                />
                                <IconButtonWithTooltip
                                    tooltip={`${!showEmbed ? "Reveal" : "Hide"} show`}
                                    icon={<PiYoutubeLogoLight size={"25px"} />}
                                    onClick={toggleEmbed}
                                />
                            </HStack>
                        </HStack>
                        <Text>Aired on {formatDate(data.show.date)}</Text>
                    </VStack>

                    {showEmbed && (
                        <AspectRatio ratio={16 / 9} layerStyle="boxed">
                            <iframe
                                sandbox="allow-scripts allow-same-origin"
                                src={`https://www.youtube.com/embed/${data.show.id}?autoplay=1&start=${60 * 33}&rel=0`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                        </AspectRatio>
                    )}

                    {tabs}

                    <DataTable
                        rows={data.players.sort(sortAppearanceByStats(data.stats[activeTab])).map((player) => {
                            const stat = data.stats[activeTab]?.find((stat) => stat.player === player.player);
                            return [
                                <PlayerLink playerName={player.player_name} playerId={player.player} />,
                                stat ? <StatFromType type={activeTab} value={stat.value} /> : <MissingStat />,
                            ];
                        })}
                    />

                    {debug && (
                        <>
                            <DebugLinks
                                links={{
                                    "AssetRipper logs": debugLinks.assetRipperLogs(data.show.id),
                                    "AssetRipper assets": debugLinks.assetRipperAssets(data.show.id),
                                    "FrameAnalysis logs": debugLinks.frameAnalysis(data.show.id),
                                    "FrameAnalysis assets": debugLinks.frameAnalysisAssets(data.show.id),
                                }}
                            />
                            <QueryDebug query={show} />
                        </>
                    )}
                </PageElementStack>
            )}
        </RenderQuery>
    );
}
