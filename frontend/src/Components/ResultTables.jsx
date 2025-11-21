import React from "react";

export default function ResultsTable({ results }) {
  if (!results) return null;
  return (
    <div className="bg-white p-4 rounded shadow-sm mt-4 overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="text-left">
            <th className="p-2">Rule</th>
            <th className="p-2">Status</th>
            <th className="p-2">Evidence</th>
            <th className="p-2">Reasoning</th>
            <th className="p-2">Confidence</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-2 align-top">{r.rule}</td>
              <td className="p-2 align-top font-semibold">{r.status.toUpperCase()}</td>
              <td className="p-2 align-top">{r.evidence}</td>
              <td className="p-2 align-top">{r.reasoning}</td>
              <td className="p-2 align-top">{r.confidence}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
