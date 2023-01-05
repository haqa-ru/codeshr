import { useEffect, useRef, useState } from "react";
import { useDelayedEffect } from "./useDelayedEffect";
import { useUpdateEffect } from "./useUpdateEffect";

export interface IShared {
  id: string | null;
  code: string;
  language: string;
  secure: boolean;
  secret: string | null;
}

export type status = "BAD" | "OK" | "WAIT" | "FORBID";

export function useShared(
  id?: string,
  secret?: string
): [IShared, (data: Partial<IShared>) => void, status] {
  const getSecret = (id: string) => {
    const storage = localStorage.getItem("secret");

    if (!storage) return undefined;

    const data: Record<string, string> = JSON.parse(storage);

    return data[id];
  };

  const setSecret = (id: string, secret: string) => {
    const storage = localStorage.getItem("secret");

    const data: Record<string, string> = storage ? JSON.parse(storage) : {};

    data[id] = secret;

    localStorage.setItem("secret", JSON.stringify(data));

    return secret;
  };

  const [shared, setShared] = useState<IShared>({
    id: null,
    code: "",
    language: "plaintext",
    secure: false,
    secret: null,
  });

  const [status, setStatus] = useState<status>("OK");

  const updateShared = (data: Partial<IShared>) => {
    if (data.secret && data.id) setSecret(data.id, data.secret);

    setShared((oldState) => {
      return { ...oldState, ...data };
    });
  };

  const idRef = useRef(id);
  const secretRef = useRef(secret);
  const updateSharedRef = useRef(updateShared);

  useEffect(() => {
    const fetchInitialData = async (id: string) => {
      setStatus("WAIT");

      const res = await fetch(`/api/share/${idRef.current}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        updateSharedRef.current({
          id: idRef.current,
          secret: idRef.current ? getSecret(idRef.current) : secretRef.current,
        });
        updateSharedRef.current(await res.json());
        setStatus("OK");
      } else if (res.status === 500) {
        setStatus("BAD");
      } else {
        updateSharedRef.current({ id: null });
      }
    };

    if (idRef.current) {
      fetchInitialData(idRef.current);
    }
  }, []);

  useDelayedEffect(
    () => {
      const commitData = async (body: IShared) => {
        setStatus("WAIT");

        const res = await fetch(`/api/share/${body.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          setStatus("OK");
        } else if (res.status === 403) {
          setStatus("FORBID");
        } else {
          setStatus("BAD");
        }
      };

      const commitInitialData = async (body: IShared) => {
        setStatus("WAIT");

        const res = await fetch("/api/share", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          updateShared(await res.json());
          setStatus("OK");
        } else {
          setStatus("BAD");
        }
      };

      if (shared.id) commitData(shared);
      else commitInitialData(shared);
    },
    300,
    [shared.code, shared.language, shared.id]
  );

  useUpdateEffect(() => {
    const secureData = async (body: IShared) => {
      await fetch(`/api/share/${body.id}?secret=${shared.secret}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      updateShared({ id: null });
    };

    if (shared.id) secureData(shared);
  }, [shared.secure]);

  return [shared, updateShared, status];
}
