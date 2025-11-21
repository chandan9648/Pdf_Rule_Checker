import React, { useRef } from "react";

export default function UploadForm({ file, setFile, onUseSample }) {
  const inputRef = useRef();

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border">
      <label className="block mb-3 font-semibold text-gray-700 text-lg">
        Upload PDF
      </label>

      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="border rounded-lg p-2 w-full md:w-auto focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={onUseSample}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-lg text-sm shadow"
        >
          Use Sample PDF
        </button>
      </div>

      {file && (
        <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-2 rounded border">
          <span className="font-semibold">Selected:</span> {file.name}
        </div>
      )}
    </div>
  );
}
