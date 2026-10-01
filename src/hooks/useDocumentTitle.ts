import { useEffect } from 'react';

/** Sets the tab title while the component is mounted, then restores the previous one. */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}
