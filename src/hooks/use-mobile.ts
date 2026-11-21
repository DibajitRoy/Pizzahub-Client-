import { useSyncExternalStore } from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      media.addEventListener("change", onChange)
      return () => media.removeEventListener("change", onChange)
    },
    () => window.innerWidth < MOBILE_BREAKPOINT,
    () => false,
  )
}
