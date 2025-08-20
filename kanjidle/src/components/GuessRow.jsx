import React from "react";
import GuessCell from "./GuessCell";

export default function GuessRow({ guess, evaluation, lenState }) { 
  return(
  <div className="flex justify-center gap-1 flex-wrap">
    {guess.split("").map((ch, i) => (
      <GuessCell key={i} ch={ch} state={evaluation[i]} lenState={lenState} />
    ))}
  </div>
)};