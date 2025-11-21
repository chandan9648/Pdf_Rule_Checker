import React from "react";

export default function RuleInputs({ rules, setRules }) {
  const setAt = (i, val) => {
    const copy = [...rules];
    copy[i] = val;
    setRules(copy);
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm space-y-2">
      <label className="block font-medium">Rules (3)</label>
      {[0,1,2].map(i => (
        <input
          key={i}
          value={rules[i] || ""}
          onChange={(e) => setAt(i, e.target.value)}
          placeholder={`Rule ${i+1} — e.g. "Document must include a publication date"`}
          className="w-full p-2 border rounded"
        />
      ))}
    </div>
  );
}
