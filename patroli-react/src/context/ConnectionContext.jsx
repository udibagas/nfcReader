import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { checkConnection } from "../utils/api";
import ConenctionStatus from "../components/ConnectionStatus";

const ConnectionContext = createContext(null);

export const ConnectionProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      checkConnection()
        .then(() => setIsConnected(true))
        .catch(() => setIsConnected(false));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ConnectionContext.Provider value={isConnected}>
      <ConenctionStatus />
      {children}
    </ConnectionContext.Provider>
  );
};

ConnectionProvider.propTypes = {
  children: PropTypes.node,
};

export default ConnectionContext;
