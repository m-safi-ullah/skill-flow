import { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authRole, setAuthRole] = useState("");
  const [authId, setAuthId] = useState("");
  const [restricted, setRestricted] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        authName,
        setAuthName,
        authEmail,
        setAuthEmail,
        authRole,
        setAuthRole,
        authId,
        setAuthId,
        restricted,
        setRestricted,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
