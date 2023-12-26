import { interpret } from "xstate";
import { phoneKeypadMachine } from "./phoneKeypad.fsm";

// eslint-disable-next-line no-promise-executor-return
const waitFor = async (time: number) => new Promise((r) => setTimeout(r, time));

describe("phoneKeypad", () => {
  it("should be able to type using the keys", async () => {
    const fsm = interpret(phoneKeypadMachine);
    fsm.start();

    fsm.send({ type: "KEY.PRESSED", key: 0 });
    await waitFor(500);
    expect(fsm.getSnapshot().context.str).toBe("1");

    fsm.send({ type: "KEY.PRESSED", key: 1 });
    await waitFor(200);
    fsm.send({ type: "KEY.PRESSED", key: 1 });
    await waitFor(200);
    fsm.send({ type: "KEY.PRESSED", key: 1 });
    await waitFor(200);
    fsm.send({ type: "KEY.PRESSED", key: 1 });
    await waitFor(500);

    expect(fsm.getSnapshot().context.str).toBe("12");
  });

  it("pressing different key will added the current key to string", async () => {
    const fsm = interpret(phoneKeypadMachine).start();

    fsm.send({ type: "KEY.PRESSED", key: 0 });

    fsm.send({ type: "KEY.PRESSED", key: 1 });

    fsm.send({ type: "KEY.PRESSED", key: 2 });

    await waitFor(500);

    expect(fsm.getSnapshot().context.str).toBe("1AD");
  });

  it("pressing delete will remove the last char", async () => {
    const fsm = interpret(phoneKeypadMachine.withConfig({})).start();

    fsm.send({ type: "KEY.PRESSED", key: 0 });

    fsm.send({ type: "KEY.PRESSED", key: 1 });

    fsm.send({ type: "KEY.PRESSED", key: 2 });

    await waitFor(500);
    expect(fsm.getSnapshot().context.str).toBe("1AD");

    fsm.send({ type: "DELETE.PRESSED" });
    expect(fsm.getSnapshot().context.str).toBe("1A");

    fsm.send({ type: "DELETE.PRESSED" });
    fsm.send({ type: "DELETE.PRESSED" });
    expect(fsm.getSnapshot().context.str).toBe("");
  });
});
