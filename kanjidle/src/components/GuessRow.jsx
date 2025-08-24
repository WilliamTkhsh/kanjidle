import React, { useEffect, useState } from "react";
import GuessCell from "./GuessCell";

export default function GuessRow({ guess, evaluation, lenState, animate = false }) {
  const [mounted, setMounted] = useState(!animate);

  useEffect(() => {
    if (!animate) return;
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, [animate]);

  return (
    <div className="flex justify-center gap-1 flex-wrap">
      {guess.split("").map((ch, i) => (
        <GuessCell
          key={i}
          ch={ch}
          state={evaluation[i]}
          lenState={lenState}
          animate={animate}
          mounted={mounted}
          delay={i * 70}
        />
      ))}
    </div>
  );
};