import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useBuffer } from "@/hooks/useBuffer";

const spamCount = 5;
const timeThreshold = 1000;

/**
 * Sometimes we want to test a feature out in a soft-launched fashion. Create a key combination of
 * spamming the shift key, which will reveal hidden features for those who know to look for them.
 */
export function useShiftWasSpammed(): boolean {
    const [keypresses, pushKeyPress] = useBuffer<number>(spamCount);
    const [debugActivated, setDebugActivated] = useState(false);
    const toast = useToast({ duration: 2000 });

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Shift") {
                pushKeyPress(e.timeStamp);
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!debugActivated && keypresses.length === spamCount && keypresses[4] - keypresses[0] < timeThreshold) {
            setDebugActivated(true);
            toast({ title: "Debug mode", description: "Debug mode has been switched on.", status: "success" });
        }
    }, [keypresses, debugActivated, setDebugActivated, toast]);

    return debugActivated;
}
