import { createContext, ReactNode } from "react";
import { IShared, status, useShared } from "../hooks/useShared";

interface ISharedContext {
  shared: IShared;
  updateShared: (data: Partial<IShared>) => void;
  status: status;
}

const SharedContext = createContext<ISharedContext>({
  shared: {
    id: null,
    code: "",
    language: "plaintext",
    secure: false,
    secret: null,
  },
  updateShared: () => {},
  status: "INIT",
});

export function SharedProvider({
  id,
  secret,
  children,
}: {
  id?: string;
  secret?: string;
  children: ReactNode;
}) {
  const [shared, setShared, status] = useShared(id || null, secret);

  return (
    <SharedContext.Provider
      value={{
        shared: shared,
        updateShared: setShared,
        status: status,
      }}
    >
      {children}
    </SharedContext.Provider>
  );
}

export default SharedContext;
