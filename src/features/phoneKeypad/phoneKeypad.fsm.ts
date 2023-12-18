import { assign, createMachine } from "xstate";
import { PHONE_KEYS } from "./constant";

type MachineContext = {
  currentSelectedArrayIndex?: number;
  currentSelectedSubArrayIndex?: number;
  lastPressedKey?: number;
  str: string;
};

type MachineEvent =
  | {
      type: "KEY.PRESSED";
      key: number;
    }
  | {
      type: "DELETE.PRESSED";
    };

export const phoneKeypadMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcAWB7AdmA0mAnsgIYQB0AkhADZgDEOAogJqkAKASgwMpcMAiAbQAMAXUQp0sAJYAXKVnEgAHogC0AFiGkAjADYATOoDsAVm36jAZiO6AnCYA0IfIkO7S1k2aE2jN9boAvoFOaFi4BMRkAOpEslKYUAAEAGboAE5JANYESQBGYAnJyOlwsJBJRFBxmPTMbJw8-MJiSCDIkvEKbSoIqhbuZrb6JurWQpba6iZGTi4Iuur6pOr2ABzq2j5GAUJrwaEY2HiEJKSx8YmpGdm5BUVJJWUVVTV1LBzcvILarRLScm6oF62lsa1I+i21jW5i8liEjmciEW7j8q1skzWPhG+gO7SOEVOMTiMgqcgAtmBHkRYOUILQWooOgD5JhFL1NEZSCZLLYjGtLLpLAF9IY5ohtCZwbpJSNLPo1mCfBs8WFjpEzhc5Fc0pkcvh8oUrk9aS9qglaEpYDIiKTSEQUqT0gAKExCIQASloasJUXOJIeutuBvuxtKpoglXNmEZbWZXTZPVck1IRm0a10UplthlQrW4oQ1lsK1FQl0E1BGKWJlVBJOfsoNFofAYABkGAAVBgNL7NURMzqAxPAtSGdSkNZY3TliaC6d8guS8EmOx6OeGUG6IzBEIgTDoCBwJl1jUQAcsoHKNTy8dDEZjIwV6azJEILap2yfnNrKWmIQBfZdx9eszkbMBzwTdlkSEAswRWHYvx-bRoVsWtwhA4lLmSIN9UNB4TTpKMaggocoL6bRtC5SwpVFdNRXUGF1ALJZxxlTYjFsIRJR8HkgiAk8iX9WQySkSlqQjEjWTI8ZU2nSwMyECxJ3kgsFUsUhOMFQV2IVSF1B3QIgA */
    id: "phoneKeypad",
    tsTypes: {} as import("./phoneKeypad.fsm.typegen").Typegen0,
    context: {
      str: "",
    },
    states: {
      Idle: {
        on: {
          "KEY.PRESSED": {
            target: "Waiting for key being pressed again",
            description: `First press, will select the array group`,
            actions: "onFirstPress",
          },

          "DELETE.PRESSED": {
            target: "Idle",
            internal: true,
            actions: "onDeleteLastChar",
          },
        },
      },

      "Waiting for key being pressed again": {
        on: {
          "KEY.PRESSED": [
            {
              target: "Waiting for key being pressed again",
              description: `Cycle through the subarray.  Pressing a key will reset the wait time because this is an "external" self-transition.`,
              actions: "onNextPress",
              cond: "isTheSameKey?",
            },
            {
              target: "Waiting for key being pressed again",
              internal: true,
              actions: ["assignToString", "removeSelectedKey", "onFirstPress"],
            },
          ],
        },

        after: {
          "500": "Waited time passed",
        },
      },

      "Waited time passed": {
        always: {
          target: "Idle",
          actions: ["assignToString", "removeSelectedKey"],
        },
      },
    },

    initial: "Idle",

    predictableActionArguments: true,
    schema: {
      context: {} as MachineContext,
      events: {} as MachineEvent,
    },
  },
  {
    actions: {
      onFirstPress: assign((context, event) => ({
        currentSelectedArrayIndex: event.key,
        currentSelectedSubArrayIndex: 0,
        lastPressedKey: event.key,
      })),
      onNextPress: assign((context, event) => {
        // If the current
        if (context.currentSelectedSubArrayIndex === undefined) {
          return {
            currentSelectedSubArrayIndex: 0,
          };
        }

        if (
          context.currentSelectedArrayIndex != undefined &&
          context.currentSelectedSubArrayIndex ===
            PHONE_KEYS[context.currentSelectedArrayIndex].length - 1
        ) {
          return {
            currentSelectedSubArrayIndex: 0,
          };
        }

        return {
          currentSelectedSubArrayIndex:
            context.currentSelectedSubArrayIndex + 1,
        };
      }),
      assignToString: assign((context, event) => {
        if (
          context.currentSelectedArrayIndex === undefined ||
          context.currentSelectedSubArrayIndex === undefined
        ) {
          return {};
        }

        const newStr =
          context.str +
          PHONE_KEYS[context.currentSelectedArrayIndex][
            context.currentSelectedSubArrayIndex
          ];

        return {
          str: newStr,
        };
      }),
      removeSelectedKey: assign((context, event) => {
        return {
          currentSelectedArrayIndex: undefined,
          currentSelectedSubArrayIndex: undefined,
          lastPressedKey: undefined,
        };
      }),
      onDeleteLastChar: assign((context, event) => ({
        str: context.str.slice(0, -1),
      })),
    },
    guards: {
      "isTheSameKey?": (context, event) => event.key === context.lastPressedKey,
    },
  }
);
