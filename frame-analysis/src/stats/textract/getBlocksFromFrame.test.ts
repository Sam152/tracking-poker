import { getBlocksFromFrame } from "./getBlocksFromFrame";
import { ProvisionedThroughputExceededException } from "@aws-sdk/client-textract";
import { testPng } from "./__fixtures__/testPng";

const send = jest.fn();

jest.mock("@aws-sdk/client-textract", () => ({
    ...jest.requireActual("@aws-sdk/client-textract"),
    TextractClient: class Client {
        send(...args: any[]) {
            return send(...args);
        }
    },
}));

jest.mock("../../util/sleepRandom", () => ({
    sleepRandom: () => null,
}));

describe("extractBlocksFromFrame", () => {
    beforeEach(() => {
        send.mockReset();
        console.log = jest.fn();
        console.error = jest.fn();
    });

    test("analysis will be retried 5 times before returning", async () => {
        const e = new ProvisionedThroughputExceededException({
            message: "Too much juice",
            $metadata: {},
        });
        send.mockImplementation(() => {
            throw e;
        });
        await expect(getBlocksFromFrame(testPng)).rejects.toThrow(e);
        expect(send).toHaveBeenCalledTimes(5);
    });
});
