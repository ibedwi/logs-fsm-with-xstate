import { createModel } from "@xstate/test";
import { fanMachine } from "./fanMachine.fsm";

import { createMachine } from "xstate";

// @ts-ignore
const fanModel = createModel(fanMachine).withEvents({
  "USER.PRESS.ON": {},
  "USER.PRESS.OFF": {},
});

describe("fanMachine", () => {
  const testPlans = fanModel.getShortestPathPlans({
    filter: (state) => state.context.fanSpeed === 1,
  });

  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      plan.paths.forEach((path) => {
        it(path.description, () => {
          path.test(fanMachine);
        });
      });
    });
  });

  it("should have full coverage", () => {
    return fanModel.testCoverage();
  });
});
