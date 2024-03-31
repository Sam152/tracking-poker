import {handler} from "./index";

describe('index', () => {
    test('handler throws on invalid event schema', async () => {
        await expect(handler({
            "not-a-nice-event": 99,
        } as any, {awsRequestId: "foo"}, () => null)).rejects.toThrow('invalid_type');
    });
});
