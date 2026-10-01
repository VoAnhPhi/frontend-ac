import { useRef, type RefObject, type UIEvent } from 'react';

/**
 * Keeps two horizontal scrollers at the same position, such as an extra scrollbar above a wide
 * table. Spread `first` on one element and `second` on the other.
 */
export function useSyncedScroll<T extends HTMLElement>() {
  const firstRef = useRef<T>(null);
  const secondRef = useRef<T>(null);
  const follow = (target: RefObject<T | null>) => (event: UIEvent<T>) => {
    if (target.current) target.current.scrollLeft = event.currentTarget.scrollLeft;
  };
  return {
    first: { ref: firstRef, onScroll: follow(secondRef) },
    second: { ref: secondRef, onScroll: follow(firstRef) },
  };
}
