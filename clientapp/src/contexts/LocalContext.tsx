import { createContext, ReactNode } from "react";
import { ILocal, useLocal } from "../hooks/useLocal";

interface ILocalContext {
  local: ILocal;
  updateLocal: (data: Partial<ILocal>) => void;
}

const LocalContext = createContext<ILocalContext>({
  local: {
    theme: "LIGHT",
    exposed: true,
  },
  updateLocal: () => {},
});

export function LocalProvider({ children }: { children: ReactNode }) {
  const [local, setLocal] = useLocal();

  return (
    <LocalContext.Provider
      value={{
        local: local,
        updateLocal: setLocal,
      }}
    >
      {children}
    </LocalContext.Provider>
  );
}

export default LocalContext;
