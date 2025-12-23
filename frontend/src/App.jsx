import { useState } from "react";
import OverwriteModal from "./componets/OverwriteModel";

export default function App() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [conflicts, setConflicts] = useState([]);
  const [currentConflict, setCurrentConflict] = useState(null);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an XML file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setStatus("Uploading XML...");

      const res = await fetch("/api/upload-xml", {
        method: "POST",
        body: formData,
      });

      setStatus("Processing XML...");

      const data = await res.json();

      setSummary({
        insertedCount: data.insertedCount,
        conflictCount: data.conflicts.length,
      });

      setConflicts(data.conflicts);
      setCurrentConflict(data.conflicts[0] || null);

      setStatus("Upload completed successfully");
    } catch (error) {
      console.error(error);
      setStatus("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOverwrite = async () => {
    await fetch("/api/overwrite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        personId: currentConflict.existingId,
        newData: currentConflict.incoming,
        overwrite: true,
      }),
    });

    const remaining = conflicts.slice(1);
    setConflicts(remaining);
    setCurrentConflict(remaining[0] || null);
  };

  const handleCancel = () => {
    const remaining = conflicts.slice(1);
    setConflicts(remaining);
    setCurrentConflict(remaining[0] || null);
  };

  return (
    <div className="app-container">
      <div className="upload-card">
        <h1 className="title">XML People Import</h1>

        <input
          type="file"
          accept=".xml"
          onChange={(e) => setFile(e.target.files[0])}
          className="file-input"
        />

        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload XML"}
        </button>

        {loading && (
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        )}

        {status && (
          <div className={`status-toast ${loading ? "loading" : "success"}`}>
            {status}
          </div>
        )}

        {summary && (
          <div className="summary-box">
            <p>Inserted: {summary.insertedCount}</p>
            <p>Conflicts: {summary.conflictCount}</p>
          </div>
        )}
      </div>

      <OverwriteModal
        conflict={currentConflict}
        onConfirm={handleOverwrite}
        onCancel={handleCancel}
      />
    </div>
  );
}
