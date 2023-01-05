import React, { useEffect, useRef } from "react";

export function useUpdateEffect(fn: () => void, inputs: React.DependencyList) {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) {
      return fn;
    }
    didMountRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, inputs);
}
