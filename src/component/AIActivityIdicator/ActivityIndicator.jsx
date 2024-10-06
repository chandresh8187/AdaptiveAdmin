import React from "react";
import "./loading.css";
import Lottie from "lottie-react";
import Indicator from "../../Lottie/Indicator.json";
function ActivityIndicator() {
  return (
    <div className="loading-modal">
      <div
        style={{
          backgroundColor: "#000",
          padding: 15,
          borderRadius: 10,
        }}
      >
        <Lottie
          animationData={Indicator}
          loop={true}
          style={{
            height: "40px",
            width: "40px",
          }}
        />
      </div>
    </div>
  );
}

export default ActivityIndicator;
