import { useContext } from "react";
import ConnectionContext from "../context/ConnectionContext";

const ConenctionStatus = () => {
  const isConnected = useContext(ConnectionContext);

  const color = {
    [true]: "lightgreen",
    [false]: "red",
    [null]: "gray",
  };

  return (
    <div
      style={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        zIndex: 9999,
        backgroundColor: color[isConnected],
        position: "absolute",
        top: 25,
        right: 25,
      }}
    ></div>
  );
};

export default ConenctionStatus;
