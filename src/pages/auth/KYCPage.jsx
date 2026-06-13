import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";

export default function KYCPage() {
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState("national_id");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowed.includes(selected.type)) {
      setError("Please upload a JPG, PNG, or PDF file");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError("File must be less than 5MB");
      return;
    }

    setError("");
    setFile(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a document");
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("doc_type", docType);
    formData.append("file", file);

    try {
      await authService.uploadKYC(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  return (
    <div
      className='min-h-screen flex items-center justify-center px-4'
      style={{ backgroundColor: "var(--color-primary-light)" }}
    >
      <div className='w-full max-w-md'>
        <div className='card'>
          <div className='text-center mb-6'>
            <h1
              className='text-2xl font-bold'
              style={{ color: "var(--color-primary-dark)" }}
            >
              Verify Your Identity
            </h1>
            <p
              className='text-sm mt-1'
              style={{ color: "var(--color-neutral-500)" }}
            >
              Upload a government-issued ID to get verified
            </p>
          </div>

          {error && <div className='alert alert-error mb-4'>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label className='block text-sm font-medium mb-1'>
                Document Type
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className='input w-full'
              >
                <option value='national_id'>National ID</option>
                <option value='passport'>Passport</option>
                <option value='drivers_license'>Driver's License</option>
              </select>
            </div>

            <div className='mb-6'>
              <label className='block text-sm font-medium mb-1'>
                Upload Document
              </label>
              <div
                className='border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors'
                style={{
                  borderColor: file
                    ? "var(--color-primary)"
                    : "var(--color-neutral-200)",
                }}
                onClick={() => document.getElementById("kyc-file").click()}
              >
                {file ? (
                  <div>
                    <span
                      className='block text-sm font-medium'
                      style={{ color: "var(--color-primary)" }}
                    >
                      {file.name}
                    </span>
                    <span
                      className='text-xs'
                      style={{ color: "var(--color-neutral-500)" }}
                    >
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                ) : (
                  <div>
                    <span
                      className='block text-sm'
                      style={{ color: "var(--color-neutral-500)" }}
                    >
                      Click to browse
                    </span>
                    <span
                      className='text-xs'
                      style={{ color: "var(--color-neutral-500)" }}
                    >
                      JPG, PNG, or PDF (max 5MB)
                    </span>
                  </div>
                )}
                <input
                  id='kyc-file'
                  type='file'
                  accept='.jpg,.jpeg,.png,.pdf'
                  onChange={handleFileChange}
                  className='hidden'
                />
              </div>
            </div>

            <button
              type='submit'
              disabled={uploading}
              className='btn btn-primary w-full mb-3'
            >
              {uploading ? "Uploading..." : "Submit for Verification"}
            </button>
          </form>

          <button
            onClick={handleSkip}
            className='w-full text-sm font-medium'
            style={{ color: "var(--color-neutral-500)" }}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
