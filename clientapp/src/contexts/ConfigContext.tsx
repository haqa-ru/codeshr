import { createContext, ReactNode } from "react";
import { local, localUpdate, useLocal } from "../lib/useLocal";
import { shared, sharedUpdate, status, useShared } from "../lib/useShared";

interface IConfigContext {
    shared: shared;
    updateShared: (data: sharedUpdate) => void;
    local: local;
    updateLocal: (data: localUpdate) => void;
    status: status;
}

const ConfigContext = createContext<IConfigContext>({
    shared: {
        id: null,
        code: "",
        lang: "plaintext",
        secure: false,
    },
    updateShared: () => {},
    local: {
        theme: "light",
    },
    updateLocal: () => {},
    status: "WAIT",
});

export function ConfigProvider({
    id,
    children,
}: {
    id: string | null;
    children: ReactNode;
}) {
    const [local, setLocal] = useLocal();

    const [shared, setShared, status] = useShared(id);

    return (
        <ConfigContext.Provider
            value={{
                shared: shared,
                updateShared: setShared,
                local: local,
                updateLocal: setLocal,
                status: status,
            }}
        >
            {children}
        </ConfigContext.Provider>
    );
}

export default ConfigContext;
