// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "xstate.after(500)#phoneKeypad.Waiting for key being pressed again": {
      type: "xstate.after(500)#phoneKeypad.Waiting for key being pressed again";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    assignToString: "" | "KEY.PRESSED";
    onDeleteLastChar: "DELETE.PRESSED";
    onFirstPress: "KEY.PRESSED";
    onNextPress: "KEY.PRESSED";
    removeSelectedKey: "" | "KEY.PRESSED";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    "isTheSameKey?": "KEY.PRESSED";
  };
  eventsCausingServices: {};
  matchesStates:
    | "Idle"
    | "Waited time passed"
    | "Waiting for key being pressed again";
  tags: never;
}
