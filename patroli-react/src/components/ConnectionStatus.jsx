import { useContext } from "react";
import PropTypes from "prop-types";
import ConnectionContext from "../context/ConnectionContext";

const ConenctionStatus = ({ style }) => {
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
        backgroundColor: color[isConnected],
        ...style,
      }}
    ></div>
  );
};

ConenctionStatus.propTypes = {
  style: PropTypes.object,
};

export default ConenctionStatus;
