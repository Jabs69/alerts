import { useEffect } from "react";

export function usePwaBackNavigation(
  selection: boolean,
  setSelection: React.Dispatch<React.SetStateAction<boolean>>,
  opened: boolean,
  close: () => void
) {
  useEffect(() => {
    
    const handlePopState = () => {
      if (selection) {
        window.history.pushState(null, '', window.location.href);
        setSelection(false);
      } 
      else if (opened) {
        close();
      }
    };

    if (selection) {
      window.history.pushState({ selection: true }, '', window.location.href);
    }
    
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
    
  }, [selection, opened, setSelection, close]); 
}