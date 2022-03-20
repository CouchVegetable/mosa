import { useEffect, useRef } from 'react'

// inspired by https://www.joshwcomeau.com/snippets/react-hooks/use-timeout/

// run callback once after delay ms.
// callback can return a value and will get re-run after X ms then.
export const useTimeout = (callback, delay) => {
  const timeoutRef = useRef(null);
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      let next = savedCallback.current();
      if(next) timeoutRef.current = window.setTimeout(tick, next);
    }
    if (typeof delay === 'number') {
      timeoutRef.current = window.setTimeout(tick, delay);
      return () => window.clearTimeout(timeoutRef.current);
    }
  }, [delay]);

  return timeoutRef;
};
