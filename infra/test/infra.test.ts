import { app } from "../bin/infra";

test("Stack", () => {
    process.env.ENV = "staging";
    const synth = app.synth({ force: true });
    for (const stack of synth.stacks) {
        expect(stack.template).toMatchSnapshot();
    }
});
