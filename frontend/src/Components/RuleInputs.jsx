import React from "react";

export default function RuleInputs({ rules, setRules }) {
  const setAt = (i, val) => {
    const copy = [...rules];
    copy[i] = val;
    setRules(copy);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border space-y-4 mt-4">
      <label className="block font-semibold text-gray-700 text-lg">
        Define Rules (3)
      </label>

      {[0, 1, 2].map((i) => (
        <div key={i}>
          <input
            value={rules[i] || ""}
            onChange={(e) => setAt(i, e.target.value)}
            placeholder={`Rule ${i + 1} — e.g. "Document must include a publication date"`}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
        </div>
      ))}
    </div>
  );
}
