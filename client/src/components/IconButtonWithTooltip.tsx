import { forwardRef, IconButton, IconButtonProps, Tooltip } from "@chakra-ui/react";

type Props = Omit<IconButtonProps, "aria-label"> & { tooltip: string };

export const IconButtonWithTooltip = forwardRef<Props, "button">(({ tooltip, ...props }, ref) => {
    return (
        <Tooltip label={tooltip}>
            <IconButton {...props} aria-label={tooltip} ref={ref} />
        </Tooltip>
    );
});
