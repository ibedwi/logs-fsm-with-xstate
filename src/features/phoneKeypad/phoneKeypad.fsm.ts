import { assign, createMachine } from "xstate";
import { PHONE_KEYS } from "./constant";

export type MachineContext = {
  currentCharacterGroupIndex?: number;
  currentCharacterIndex?: number;
  lastPressedKey?: number;
  str: string;
};

export type MachineEvent =
  | {
      type: "KEY.PRESSED";
      key: number;
    }
  | {
      type: "DELETE.PRESSED";
    };

export const phoneKeypadMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcAWB7AdmA0mAnsgIYQB0AkhADZgDEOAogJqkAKASgwMpcMAiAbQAMAXUQp0sAJYAXKVnEgAHogCMAVlLqhANlUAmIQA4dATgDMAFnPrTAdgA0IfIn07NlnecOnVp05ZGdvoAviFOaFi4BMRklDS0fAwAMgwAKgxsnDz8wmJIIMiSsvKYiioIALT6+prqbpaqQtY1xjpOLgj65kKkqk2B-nZGpkIBdmERGNh4hCSkAOpEJZhQAAQAZugATmsA1gRrAEZgUqtryNtwsJBrRFDLmPTMWdy8gqKKRdJyCgUV1Tsmjs5j0Iw0OiCNg6iHqvVUdh0OiEPiMjRBk0K02iczISxW6y2uwO+GOp3Ol2ut3uj2eLA4b1yqnyEh+pXKah0+lIlks+mC5lM+iM6nUVhhCHq5lIVmRTVUoJG9UxkRmMXm+Lk5yJ+0OJzO60psBuEDuDzOtCUsBkRBkYFIRA2du2AAptEIAJS0VU42KLZZawk7XWk-UUq7G6nmzB5L7FX5lf6uHo83nIoxGVSWdTuVQS8wirTeTP6XkBUuhcJYqKzP2a25yAC2YAuREjEFosYK3xKf1AFSsmgCJjsdmzXnURn5Ep8PJ6QlUyNBjX0pjCVcw6AgcC+2NrJDjbL7ykQlW80pBYN8Oah6nzdhlekRej8SPUz5Ve-VcWoYEPvcTftT3MaUhHMIEES8XkQIzCUDEsHlRXUDRLFMKcoSMT8a2-f0CU2YMSTJA0LgjE0zUef8Ew5Kp+gfGwp30VQGMCLMJT5BC9HRUYNCEIFQSwtVcVwu1TSbFtiHbSj2STBBBQQ0d+iY0sF3cUw72cRBwO5ED3BFUY0O6Nd1yAA */
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

        description: `The machine waiting for user's input.`,
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
              description: `When new key is pressed, the last selected character will be added to the context and the current selected array element is updated.`,
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
        currentCharacterGroupIndex: event.key,
        currentCharacterIndex: 0,
        lastPressedKey: event.key,
      })),
      onNextPress: assign((context, event) => {
        // If the current
        if (context.currentCharacterIndex === undefined) {
          return {
            currentCharacterIndex: 0,
          };
        }

        if (
          context.currentCharacterGroupIndex != undefined &&
          context.currentCharacterIndex ===
            PHONE_KEYS[context.currentCharacterGroupIndex].length - 1
        ) {
          return {
            currentCharacterIndex: 0,
          };
        }

        return {
          currentCharacterIndex: context.currentCharacterIndex + 1,
        };
      }),
      assignToString: assign((context, event) => {
        if (
          context.currentCharacterGroupIndex === undefined ||
          context.currentCharacterIndex === undefined
        ) {
          return {};
        }

        const newStr =
          context.str +
          PHONE_KEYS[context.currentCharacterGroupIndex][
            context.currentCharacterIndex
          ];

        return {
          str: newStr,
        };
      }),
      removeSelectedKey: assign((context, event) => {
        return {
          currentCharacterGroupIndex: undefined,
          currentCharacterIndex: undefined,
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
