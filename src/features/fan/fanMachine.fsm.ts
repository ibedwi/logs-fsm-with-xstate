import { assign, createMachine } from "xstate";

type MachineContext = {
  fanSpeed: number;
};

type MachineEvent = { type: "USER.PRESS.ON" } | { type: "USER.PRESS.OFF" };

export const fanMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QDMCGA7AdLALgewAcBiAVQGUBRAJUwAUqKyzMB5AOQG0AGAXUVAJ5YASxzC86fiAAeiAIxcArJjkAWLgDZFADi5ztAZlUAmAOzGANCACeiRcsWqN2xVsULTS4wF9vVtFiwBMLopJQ09IzMLABiMdx8SCCCImISUrIIALRyigYqigCcBs6FqnIaBopKVrYI9piOzq72HkpKvn4g6HgQcFIBUimi4pJJmVnGegXFpeWV1Yq1iDnG2piFxoUaphqVW6aqBr7+GNj4BENCI+njiMaqmKZyz2UVR1MahUs2K+WYhiKZmMjiqxh2JxAAWwwTGAmuaThMnk6wMXFUz20zi4aJ2a2WCBepgBRiMck2RjKhVMnW8QA */
    id: "fan",
    // tsTypes: {} as import("./fanMachine.fsm.typegen").Typegen0,
    schema: {
      events: {} as MachineEvent,
      context: {} as MachineContext,
    },
    context: {
      fanSpeed: 0,
    },
    states: {
      stop: {
        on: {
          "USER.PRESS.ON": {
            target: "spin",
            actions: "changeFanSpeed",
          },
        },
        meta: {
          test: () => {},
        },
      },

      spin: {
        on: {
          "USER.PRESS.OFF": {
            target: "stop",
            actions: "changeFanSpeed",
          },
        },
        meta: {
          test: () => {},
        },
      },
    },

    initial: "stop",
    predictableActionArguments: true,
  },
  {
    actions: {
      changeFanSpeed: assign((_context, event) => {
        if (event.type === "USER.PRESS.ON") {
          return {
            fanSpeed: 1,
          };
        }
        if (event.type === "USER.PRESS.OFF") {
          return {
            fanSpeed: 0,
          };
        }
        return {};
      }),
    },
  }
);
