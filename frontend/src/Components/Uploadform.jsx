import React, { useRef } from "react";

export default function UploadForm({ file, setFile, onUseSample }) {
  const inputRef = useRef();

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <label className="block mb-2 font-medium">PDF Upload</label>
      <div className="flex gap-2 items-center">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="border rounded p-2"
        />
        <button
          onClick={onUseSample}
          className="px-3 py-2 bg-blue-600 text-white rounded text-sm"
        >
          Use Sample PDF
        </button>
      </div>
      {file && <div className="mt-2 text-sm">Selected: {file.name}</div>}
    </div>
  );
}
