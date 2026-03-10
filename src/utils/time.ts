import { useEffect, useState } from "preact/hooks";

export function useNow(tickMs = 1000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), tickMs);
    return () => window.clearInterval(timer);
  }, [tickMs]);

  return now;
}
