import React, { useRef, useState } from "react";

const OtpInput = ({ otp = [], onChange }) => {
  const inputRef = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  function handleInput(i, e) {
    if (e <= "9" && e >= "0") {
      onChange((otp) => {
        let temp = [...otp];
        temp[i] = e;
        return temp;
      });
      if (i < otp.length - 1) {
        inputRef[i + 1].current.focus();
      }
    } else {
      if (e == "Backspace") {
        if (otp[i] == "") {
          if (i > 0) {
            inputRef[i - 1].current.focus();
          }
        } else {
          onChange((otp) => {
            let temp = [...otp];
            temp[i] = "";
            return temp;
          });
        }
      }
    }
  }

  return (
    <div className="w-full  flex justify-between px-7 items-center">
      {otp.map((value, index) => (
        <input
          key={index}
          type="number"
          name={index}
          ref={inputRef[index]}
          value={value}
          onChange={(e) => handleInput(index, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Backspace") handleInput(index, e.key);
          }}
          className="bg-['#f5f5f5] border font-USBold focus:border rounded-md focus:border-Primary outline-none  h-[40px] w-[40px] text-center p-2 flex justify-center items-center"
        />
      ))}
    </div>
  );
};
export default OtpInput;
