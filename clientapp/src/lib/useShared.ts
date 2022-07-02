import { useEffect, useState } from "react";
import { useDelayedEffect } from "./useDelayedEffect";
import { useUpdateEffect } from "./useUpdateEffect";

export type shared = {
    id: string | null;
    code: string;
    lang: string;
    secure: boolean;
};

export type sharedUpdate = {
    id?: string | null;
    code?: string;
    lang?: string;
    secure?: boolean;
};

export type status = "BAD" | "OK" | "WAIT";

export function useShared(
    id: string | null
): [shared, (data: sharedUpdate) => void, status] {
    const [shared, setShared] = useState<shared>({
        id: id,
        code: "",
        lang: "plaintext",
        secure: false,
    });

    const [status, setStatus] = useState<status>("WAIT");

    const updateShared = (data: sharedUpdate) => {
        data = Object.fromEntries(
            Object.entries(data).filter(([k, v]) => typeof v !== "undefined")
        );

        window.history.pushState("", "", data.id || "");

        setShared((oldState) => {
            return { ...oldState, ...data };
        });
    };

    useEffect(() => {
        const fetchInitialData = async (id: string) => {
            setStatus("WAIT");
            const res = await fetch(`/api/share/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                updateShared(await res.json());
            } else if (res.status === 500) {
                setStatus("BAD");
            } else {
                updateShared({ id: null });
            }
        };

        if (shared.id) fetchInitialData(shared.id);
    }, []);

    useDelayedEffect(
        () => {
            const commitData = async (body: {
                id: string;
                code: string;
                lang: string;
                secure: boolean;
            }) => {
                const res = await fetch(`/api/share/${body.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                });

                if (res.ok) {
                    setStatus("OK");
                } else {
                    setStatus("BAD");
                }
            };

            if (shared.id) commitData({ ...shared, id: shared.id });
        },
        500,
        [shared.code, shared.lang]
    );

    useUpdateEffect(() => {
        const commitInitialData = async (body: {
            code: string;
            lang: string;
            secure: boolean;
        }) => {
            const res = await fetch("/api/share", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                updateShared({ id: (await res.json()).id });
                setStatus("OK");
            } else {
                setStatus("BAD");
            }
        };

        setStatus("WAIT");

        if (!shared.id) commitInitialData(shared);
    }, [shared.code]);

    useUpdateEffect(() => {
        const secureData = async (body: {
            code: string;
            lang: string;
            secure: boolean;
        }) => {
            setStatus("WAIT");
            await fetch(`/api/share/${shared.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            updateShared({ id: null });

            const res = await fetch("/api/share", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                updateShared({ id: (await res.json()).id });
                setStatus("OK");
            } else {
                setStatus("BAD");
            }
        };

        secureData(shared);
    }, [shared.secure]);

    return [shared, updateShared, status];
}
