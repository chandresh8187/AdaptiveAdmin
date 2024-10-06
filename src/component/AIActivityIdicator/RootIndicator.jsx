import Lottie from "lottie-react";
import React, { useEffect, useState } from "react";
import Indicator from "../../Lottie/Indicator.json";
import { subscribeToLoading } from "../../API/LoadingManager";
import { subscribeRootToLoading } from "../../API/RootLoadingManager";
function RootIndicator() {
  const [loading, setloading] = useState(false);

  useEffect(() => {
    subscribeRootToLoading((isLoading) => {
      setloading(isLoading);
    });
  }, []);

  return (
    loading && (
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
    )
  );
}

export default RootIndicator;
