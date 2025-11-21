import React from "react";

export default function ResultsTable({ results }) {
  if (!results) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border mt-6 overflow-x-auto">
      <table className="w-full table-auto text-sm">
        <thead className="bg-gray-100 border-b">
          <tr className="text-left text-gray-700">
            <th className="p-3">Rule</th>
            <th className="p-3">Status</th>
            <th className="p-3">Evidence</th>
            <th className="p-3">Reasoning</th>
            <th className="p-3">Confidence</th>
          </tr>
        </thead>

        <tbody>
          {results.map((r, idx) => (
            <tr
              key={idx}
              className="border-b hover:bg-gray-50 transition"
            >
              <td className="p-3 align-top font-medium text-gray-700">
                {r.rule}
              </td>

              <td
                className={`p-3 align-top font-semibold ${
                  r.status === "pass"
                    ? "text-green-600"
                    : r.status === "fail"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {r.status.toUpperCase()}
              </td>

              <td className="p-3 align-top text-gray-600">{r.evidence}</td>
              <td className="p-3 align-top text-gray-600">{r.reasoning}</td>
              <td className="p-3 align-top font-semibold text-gray-700">
                {r.confidence}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
