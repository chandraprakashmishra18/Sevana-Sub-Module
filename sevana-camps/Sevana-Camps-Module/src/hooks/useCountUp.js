import { useEffect, useRef, useState } from "react";

// Animates a number from 0 to `end` over `duration` ms.
function useCountUp(end, duration = 1500, start = true) {
  const [count, setCount] = useState(0);
  const frameRef = useRef();

  useEffect(() => {
    if (!start) return;

    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameRef.current);
  }, [end, duration, start]);

  return count;
}

export default useCountUp;