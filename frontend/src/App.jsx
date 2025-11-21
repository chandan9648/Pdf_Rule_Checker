import React, { useState } from "react";
import UploadForm from "./Components/Uploadform";
import RuleInputs from "./Components/RuleInputs";
import ResultsTable from "./Components/ResultTables";
import { checkPdf, getSampleFileUrl } from "./api";

export default function App() {
  const [file, setFile] = useState(null);
  const [rules, setRules] = useState(["", "", ""]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const submit = async () => {
    if (!file) return alert("Please upload a PDF first.");
    if (!rules.some(r => r.trim())) return alert("Enter at least one rule.");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("rule1", rules[0] || "");
    fd.append("rule2", rules[1] || "");
    fd.append("rule3", rules[2] || "");

    setLoading(true);
    setProgress(0);
    try {
      const data = await checkPdf(fd, (evt) => {
        if (evt.lengthComputable) {
          setProgress(Math.round((evt.loaded / evt.total) * 100));
        }
      });
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
      alert("Error: " + (err?.response?.data?.error || err.message));
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const useSample = async () => {
    try {
      const res = await getSampleFileUrl();
      // The backend returns a file:// URL; we need to fetch it and convert to a File object
      const fileUrl = res.path;
      // Attempt to fetch via backend proxy (not possible with file://); instead, show instructions:
      // We will call the backend to get the path (already done). The easiest is to download the file manually
      // and attach it. For convenience in dev, we attempt to fetch via the server (if server serves it), else notify.
      alert(`Sample file available at: ${fileUrl}\n\nDownload it and choose it in the upload input, or use a direct curl to download.`);
    } catch (err) {
      alert("Could not fetch sample file: " + (err?.message || err));
    }
  };

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-4">PDF Rule Checker</h1>
      <div className="grid grid-cols-1 gap-4">
        <UploadForm file={file} setFile={setFile} onUseSample={useSample} />
        <RuleInputs rules={rules} setRules={setRules} />
        <div className="flex gap-2">
          <button onClick={submit} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">
            {loading ? `Checking... ${progress}%` : "Check Document"}
          </button>
          <button onClick={() => { setFile(null); setResults(null); setRules(["","",""]); }} className="px-3 py-2 bg-gray-200 rounded">
            Reset
          </button>
        </div>

        <ResultsTable results={results} />
      </div>
    </div>
  );
}
