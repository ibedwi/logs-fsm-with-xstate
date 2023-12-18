"use client";

import { useInterpret, useSelector } from "@xstate/react";
import { PHONE_KEYS } from "./constant";
import { phoneKeypadMachine } from "./phoneKeypad.fsm";
import classes from "./phoneKeypad.module.css";

export function PhoneKeypad() {
  const fsm = useInterpret(phoneKeypadMachine, {
    context: {
      str: "",
    },
  });
  const { selectedIndex, selectedIndexElement, value, isIdle } = useSelector(
    fsm,
    (state) => ({
      selectedIndex: state.context.currentSelectedArrayIndex,
      selectedIndexElement: state.context.currentSelectedSubArrayIndex,
      value: state.context.str,
      isIdle: state.matches("Idle"),
    })
  );

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="grid grid-cols-3 gap-4">
        <div className="w-full border border-solid col-span-3 h-[50px] max-w-[332px] flex justify-start items-center px-4">
          <p className="max-w-full overflow-x-auto flex-nowrap whitespace-nowrap">
            {value}
            {selectedIndex != undefined &&
              selectedIndexElement != undefined && (
                <span>{PHONE_KEYS[selectedIndex][selectedIndexElement]}</span>
              )}

            <span
              className={[classes.blinkingCaret, isIdle ? "" : "hidden"].join(
                " "
              )}
            >
              |
            </span>
          </p>
        </div>
        <button
          className={[
            "col-start-3 col-end-3",
            "w-[90px] rounded-lg bg-gray-100 flex flex-col justify-center items-center py-4",
            "hover:bg-gray-200 cursor-pointer active:bg-gray-300",
          ].join(" ")}
          onClick={() => fsm.send({ type: "DELETE.PRESSED" })}
        >
          DEL
        </button>
        {PHONE_KEYS.map((key, index) => (
          <button
            key={index}
            className={[
              "w-[90px] h-[90px] rounded-lg bg-gray-100 flex flex-col justify-center items-center",
              "hover:bg-gray-200 cursor-pointer active:bg-gray-300",
            ].join(" ")}
            style={{
              userSelect: "none",
            }}
            onClick={() => fsm.send({ type: "KEY.PRESSED", key: index })}
          >
            <p className="text-2xl">{index + 1}</p>
            <div className="gap-1 flex">
              {key.map((k) => (
                <span key={k}>{k === " " ? "_" : k}</span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
