import { handleEvent } from "./handleEvent";
import { sampleEventStreamFixture } from "./__fixtures__/sample-event-stream";
import { StructuredQuery } from "./queries";
import { allDataForShow } from "./queries/allDataForShow";
import { stamp } from "../util/nominalType";
import { ShowId } from "./entity/show";
import { allDataForShowFixture } from "./__fixtures__/queries/allDataForShowFixture";
import { QueryExecutor } from "../dynamo/executeQuery";

jest.setTimeout(60 * 60 * 1000);

describe("handleEvent", () => {
    test("projections built from event stream", async () => {
        // The only query that is made while handling an event is for a given show.
        const executeQuery = (<T>(query: StructuredQuery<T>) => {
            return Promise.resolve(allDataForShow(stamp<ShowId>("dVs7ORBHsF0")).parser(allDataForShowFixture));
        }) as QueryExecutor;

        const putItem = jest.fn();

        for (const eventBridgeEvent of sampleEventStreamFixture) {
            await handleEvent(eventBridgeEvent["detail-type"], eventBridgeEvent.detail, putItem, executeQuery);
        }

        expect(putItem.mock.calls).toMatchSnapshot();
    });
});
