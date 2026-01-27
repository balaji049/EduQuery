import { useState } from "react";
import { uploadResource } from "../../services/resourceApi";

export default function UploadResource({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      await uploadResource(formData);

      setSuccess(true);
      setFile(null);
      onUpload();
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">

      {/* HEADER */}
      <div className="mb-5">
        <h2 className="text-lg font-medium text-[#0F172A]">
          Upload Knowledge Resource
        </h2>
        <p className="text-sm text-[#64748B]">
          Supported formats: PDF, DOCX, TXT · Max 10MB
        </p>
      </div>

      {/* FILE INPUT AREA */}
      <label className="flex flex-col items-center justify-center border border-dashed border-[#CBD5E1] rounded-lg p-6 cursor-pointer hover:bg-[#F3F4F4] transition">

        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />

        <p className="text-sm font-medium text-[#0F172A]">
          {file ? file.name : "Click to select a document"}
        </p>

        <p className="text-xs text-[#64748B] mt-1">
          Your AI will answer questions from this file
        </p>
      </label>

      {/* STATUS */}
      {error && (
        <p className="mt-3 text-sm text-red-500">
          {error}
        </p>
      )}

      {success && (
        <p className="mt-3 text-sm text-[#5F9598]">
          Resource uploaded successfully
        </p>
      )}

      {/* ACTION BUTTON */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className={`mt-5 w-full py-2.5 rounded-lg font-medium text-white transition
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#1D546D] hover:bg-[#163F52]"
          }`}
      >
        {loading ? "Uploading..." : "Upload Resource"}
      </button>
    </div>
  );
}
