import React from "react";
import GuessRow from "./GuessRow";

export default function GuessGrid({ guesses, evaluations }) {
  return(
  <div className="flex flex-col gap-2">
    {guesses.map((g, rIdx) => (
      <GuessRow
        key={rIdx}
        guess={g}
        evaluation={evaluations[rIdx]}
        lenState={(evaluations[rIdx] && evaluations[rIdx].lengthState) || "equal"}
        animate={rIdx === guesses.length - 1}
      />
    ))}
  </div>
)
};
