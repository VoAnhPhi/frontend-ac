import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Starts every page at the top. The router keeps the scroll position on navigation, so a page
 * would otherwise open where the previous one was scrolled, such as the token list opening
 * below its newest token after Create. The profile tabs are one page and keep their position.
 */
export function useScrollToTop() {
  const { pathname } = useLocation();
  const page = pathname.startsWith('/profile') ? '/profile' : pathname;
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);
}
