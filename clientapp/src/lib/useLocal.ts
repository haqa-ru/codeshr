import { useEffect, useState } from "react";

export type theme = "light" | "vs-dark";

export type local = {
    theme: theme;
};

export type localUpdate = {
    theme?: theme;
};

export function useLocal(): [local, (data: localUpdate) => void] {
    const [local, setLocal] = useState<local>({
        theme:
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "vs-dark"
                : "light",
    });

    const updateLocal = (data: localUpdate) => {
        data = Object.fromEntries(
            Object.entries(data).filter(([k, v]) => typeof v !== "undefined")
        );

        if (data.theme) localStorage.setItem("theme", data.theme);

        document.body.classList.toggle("BodyDark", data.theme === "vs-dark");

        setLocal((oldState) => {
            return { ...oldState, ...data };
        });
    };

    useEffect(() => {
        updateLocal({ theme: localStorage.getItem("theme") as theme });
    }, []);

    return [local, updateLocal];
}
