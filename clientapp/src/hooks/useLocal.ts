import { useEffect, useState } from "react";

export type theme = "LIGHT" | "DARK";

export interface ILocal {
  theme: theme;
  exposed: boolean;
}

export function useLocal(): [ILocal, (data: Partial<ILocal>) => void] {
  const [local, setLocal] = useState<ILocal>({
    theme:
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "DARK"
        : "LIGHT",
    exposed: false,
  });

  const updateLocal = (data: Partial<ILocal>) => {
    setLocal((oldState) => {
      return { ...oldState, ...data };
    });

    const { exposed, ...saved } = data;

    localStorage.setItem("config", JSON.stringify(saved));
  };

  useEffect(() => {
    const data = localStorage.getItem("config");

    if (data) {
      updateLocal(JSON.parse(data));
    }
  }, []);

  return [local, updateLocal];
}
