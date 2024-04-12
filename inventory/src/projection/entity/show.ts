import { StampedType } from "../../util/nominalType";

export type ShowId = StampedType<string, "ShowId">;
export type OperatorId = StampedType<string, "OperatorId">;
export type ShowDate = `${string}/${string}/${string}`;

export type Show = {
    id: ShowId;
    show_name: string;
    operator: OperatorId;
    date: ShowDate;
    duration: number;
};

export type ShowStorage = Show & {
    entity_type: "show";
    pk: `operator#${OperatorId}`;
    sk: `show#date#${ShowDate}#slug#${ShowId}#`;
    gsi1pk: `slug#${ShowId}`;
    gsi1sk: "show#";
};

export function toStorage(show: Show): ShowStorage {
    return {
        ...show,
        entity_type: "show",
        pk: `operator#${show.operator}`,
        sk: `show#date#${show.date}#slug#${show.id}#`,
        gsi1pk: `slug#${show.id}`,
        gsi1sk: "show#",
    };
}

// @todo, validate data from storage.
export function fromStorage(showStorage: Record<string, any>): Show {
    return {
        id: showStorage.id!,
        show_name: showStorage.show_name!,
        operator: showStorage.operator!,
        date: showStorage.date!,
        duration: showStorage.duration!,
    };
}
