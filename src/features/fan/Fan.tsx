"use client";

import { FaFan, FaDotCircle } from "react-icons/fa";
import { motion, useTime, useTransform } from "framer-motion";
import { useMachine } from "@xstate/react";
import { fanMachine } from "./fanMachine.fsm";

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export function Fan() {
  const [fsmState, fsmSendEvent] = useMachine(fanMachine);

  const isOn = fsmState.matches("spin");
  const speed = fsmState.context.fanSpeed;

  const calculatedSpeed = isOn ? 1000 - 100 * speed : 0;
  const time = useTime();

  const rotate = useTransform(
    time,
    [0, calculatedSpeed], // For every calculatedSpeed,
    [0, -360], // rotate 360 degrees to the left direction
    {
      clamp: false, // make it rotate forever
    }
  );

  return (
    <div className="flex flex-col items-stretch py-3 px-4 bg-gray-200 rounded-lg gap-5">
      <div>
        <FaDotCircle
          className={cn("text-md", isOn ? "text-green-400" : "text-red-400")}
        />
      </div>
      <motion.div
        style={{
          rotate,
        }}
        className="flex justify-center items-center"
      >
        <FaFan className="text-8xl text-gray-500" />
      </motion.div>

      <div className="flex flex-row item-center justify-between w-full gap-[150px]">
        <button
          className={cn(
            "p-2 rounded-lg",
            !isOn ? "bg-red-300 text-white" : "bg-red-400 text-black"
          )}
          onClick={() => fsmSendEvent({ type: "USER.PRESS.OFF" })}
        >
          Off
        </button>
        <button
          className={cn(
            "p-2 rounded-lg",
            isOn ? "bg-green-300 text-white" : "bg-green-400 text-black"
          )}
          onClick={() => fsmSendEvent({ type: "USER.PRESS.ON" })}
        >
          On
        </button>
      </div>
    </div>
  );
}
