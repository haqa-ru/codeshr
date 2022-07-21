import { useEffect, useState } from "react";
import { useDelayedEffect } from "./useDelayedEffect";
import { useUpdateEffect } from "./useUpdateEffect";

export interface IShared {
  id: string | null;
  code: string;
  language: string;
  secure: boolean;
  secret: string | null;
}

export type status = "BAD" | "OK" | "WAIT" | "INIT" | "DENY";

export function useShared(
  id: string | null,
  secret?: string
): [IShared, (data: Partial<IShared>) => void, status] {
  const getSecret = (id: string) => {
    const storage = localStorage.getItem("secret");

    if (!storage) {
      localStorage.setItem("secret", "{}");
      return null;
    }

    const data: Record<string, string> = JSON.parse(storage);

    return data[id] ? data[id] : null;
  };

  const setSecret = (id: string, secret: string) => {
    const storage = localStorage.getItem("secret");

    const data: Record<string, string> = storage ? JSON.parse(storage) : {};

    data[id] = secret;

    localStorage.setItem("secret", JSON.stringify(data));

    return secret;
  };

  const [shared, setShared] = useState<IShared>({
    id: id,
    code: "",
    language: "plaintext",
    secure: id ? id.length > 4 : false,
    secret: !id ? null : secret ? setSecret(id, secret) : getSecret(id),
  });

  const [status, setStatus] = useState<status>(shared.id ? "WAIT" : "INIT");

  const updateShared = (data: Partial<IShared>) => {
    setShared((oldState) => {
      return { ...oldState, ...data };
    });
  };

  useEffect(() => {
    if (shared.id && shared.secret) setSecret(shared.id, shared.secret);
  }, [shared.id, shared.secret]);

  useUpdateEffect(() => {
    setStatus("WAIT");
  }, [shared.code, shared.language, shared.secure]);

  useEffect(() => {
    const fetchInitialData = async (id: string) => {
      const res = await fetch(`/api/share/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        updateShared(await res.json());
        setStatus("OK");
      } else if (res.status === 500) {
        setStatus("BAD");
      } else {
        updateShared({ id: null });
      }
    };

    if (shared.id) fetchInitialData(shared.id);
  }, [shared.id]);

  useDelayedEffect(
    () => {
      const commitData = async (body: IShared) => {
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
          setStatus("DENY");
        } else {
          setStatus("BAD");
        }
      };

      const commitInitialData = async (body: IShared) => {
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
      await fetch(`/api/share/${body.id}`, {
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
