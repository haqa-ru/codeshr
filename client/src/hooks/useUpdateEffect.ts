import React, { useEffect, useRef } from "react";

export function useUpdateEffect(fn: () => void, inputs: React.DependencyList) {
  const didMountRef = useRef(false);
  const fnRef = useRef(fn);

  useEffect(() => {
    if (didMountRef.current) {
      return fnRef.current();
    }
    didMountRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, inputs);
}
