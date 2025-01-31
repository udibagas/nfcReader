import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { checkConnection } from "../utils/api";

const ConenctionStatus = ({ style, onConnected }) => {
  const [isConnected, setIsConnected] = useState(null);

  const color = {
    [true]: "lightgreen",
    [false]: "red",
    [null]: "gray",
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkConnection()
        .then(() => {
          setIsConnected(true);
          onConnected?.();
        })
        .catch(() => {
          setIsConnected(false);
        });
    }, 3000);

    return () => clearInterval(interval);
  }, [onConnected]);

  return (
    <div
      style={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        backgroundColor: color[isConnected],
        ...style,
      }}
    ></div>
  );
};

ConenctionStatus.propTypes = {
  style: PropTypes.object,
  onConnected: PropTypes.func,
};

export default ConenctionStatus;
