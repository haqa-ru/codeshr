import React, { useEffect, useRef } from "react";

export function useDelayedEffect(
  fn: () => void,
  delay: number,
  inputs: React.DependencyList
) {
  const timerRef = useRef<number | null>(null);
  const didMountRef = useRef(false);
  const fnRef = useRef(fn);
  const delayRef = useRef(delay);

  useEffect(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    if (didMountRef.current) {
      timerRef.current = window.setTimeout(fnRef.current, delayRef.current);
    }

    didMountRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, inputs);
}
