import { useEffect, useState } from "react";

export function useCountUp(end: number, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!end || end <= 0) {
      setCount(0);
      return;
    }
    const start = Date.now();
    let raf = 0;
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * end));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setCount(end);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);

  return count;
}
