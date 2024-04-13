import * as path from "path";

export const bundlingVolumesWithCommon = {
    volumes: [
        {
            // The common directory must be mounted, to be discoverable by npm inside the build container.
            hostPath: path.resolve(__dirname, "../../../common"),
            containerPath: "/common",
        },
    ],
};
