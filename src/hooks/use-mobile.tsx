import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Reports whether the viewport width is less than MOBILE_BREAKPOINT pixels.
 *
 * On server-side rendering this hook always reports `false`.
 *
 * @returns `true` if the viewport width is less than `MOBILE_BREAKPOINT`, `false` otherwise.
 */
export function useIsMobile() {
  return React.useSyncExternalStore(
    (onChange) => {
      const mql = globalThis.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => globalThis.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches,
    () => false,
  );
}
