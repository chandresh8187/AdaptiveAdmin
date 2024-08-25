import React, { useState } from "react";

function CheckBox({ onClick, Checked = false, word }) {
  const [first, setfirst] = useState(Checked);
  return (
    <div
      onClick={() => {
        if (onClick) {
          onClick(word);
        }
        setfirst(!first);
      }}
      className={
        "border border-gray-400 rounded-sm  h-4 w-4 cursor-pointer flex justify-center items-center"
      }
    >
      {first && <div className="h-2 w-2 rounded-sm bg-TextPrimary"></div>}
    </div>
  );
}

export default CheckBox;
