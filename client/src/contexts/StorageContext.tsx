import { createContext, ReactNode } from "react";
import { IShared, status, useShared } from "../hooks/useShared";

interface IStorageContext {
  status: status;
  shared: IShared;
  updateShared: (data: Partial<IShared>) => void;
}

const StorageContext = createContext<IStorageContext>({
  shared: {
    id: null,
    code: "",
    language: "plaintext",
    secure: false,
    secret: null,
  },
  updateShared: () => {},
  status: "OK",
});

export function StorageProvider({
  id,
  secret,
  children,
}: {
  id?: string;
  secret?: string;
  children: ReactNode;
}) {
  const [shared, setShared, status] = useShared(id, secret);

  return (
    <StorageContext.Provider
      value={{
        shared: shared,
        status: status,
        updateShared: setShared,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
}

export default StorageContext;
