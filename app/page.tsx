"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface EncryptedFile {
  id: number;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<EncryptedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Custom Modal States
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; fileId: number | null }>({
    show: false,
    fileId: null,
  });

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetch("/api/files");
      const data = await res.json();
      if (res.ok) {
        setFiles(data.files);
      }
    } catch (err) {
      console.error("Failed to fetch files", err);
    }
  };

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget; // Capture the form element before any await
    const formData = new FormData(form);
    const file = formData.get("file") as File;
    if (!file || file.size === 0) return;

    setUploading(true);
    setError(null);

    try {
      const res = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      form.reset(); // Safely reset using the captured reference
      fetchFiles();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (fileId: number) => {
    try {
        // We open in a new tab to trigger the browser's download prompt for the decrypted binary
        window.open(`/api/files/download?id=${fileId}`, "_blank");
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.fileId) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/files/delete?id=${deleteModal.fileId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      setDeleteModal({ show: false, fileId: null });
      fetchFiles();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Hit our exact, custom API endpoint which natively dismantles the HTTP-only cookie limit!
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to log out");
      }

      // Immediately redirect to the login module sequentially.
      router.push("/login");
    } catch (err) {
      console.error(err);
      alert("There was an error logging out.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ flexDirection: "column", gap: "2rem", padding: "4rem 2rem" }}>
      <div className="glass-panel" style={{ maxWidth: "1000px", width: "95%", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ flex: "1 1 250px" }}>
            <h1 className="heading-main" style={{ marginBottom: 0 }}>Secure File Vault</h1>
            <p className="heading-sub" style={{ margin: 0 }}>
              You are securely authenticated.
            </p>
          </div>
          <button 
            onClick={handleLogout} 
            className="btn-primary" 
            disabled={loading}
            style={{ 
              background: "var(--error-color)", 
              marginTop: 0, 
              width: "auto", 
              padding: "0.5rem 1rem", 
              fontSize: "0.875rem",
              minWidth: "100px"
            }}
          >
            {loading ? <span className="spinner" style={{ width: "14px", height: "14px" }}></span> : "Log Out"}
          </button>
        </div>

        <p className="heading-sub" style={{ marginBottom: "2.5rem" }}>
          Upload sensitive files to encrypt them with AES-256-GCM.
        </p>

        {/* Upload Section */}
        <div className="metadata-box" style={{ marginBottom: "2rem" }}>
          <h3 style={{ marginBottom: "1rem", color: "#fff" }}>Encrypt & Upload File</h3>
          <form onSubmit={handleFileUpload} style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <input 
              type="file" 
              name="file" 
              className="form-input" 
              style={{ flex: "1 1 300px" }} 
              required 
              disabled={uploading}
            />
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: "auto", marginTop: 0, padding: "0.875rem 2rem" }} 
              disabled={uploading}
            >
              {uploading ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="spinner"></span>
                  <span>Encrypting...</span>
                </div>
              ) : (
                "Upload"
              )}
            </button>
          </form>
          {error && <p className="error-msg" style={{ marginTop: "1rem", marginBottom: 0 }}>{error}</p>}
        </div>

        {/* Files List */}
        <div className="metadata-box">
          <h3 style={{ marginBottom: "1rem", color: "#fff" }}>Your Encrypted Files</h3>
          {files.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", textAlign: "center", padding: "1rem 0" }}>
              No encrypted files found. Your vault is currently empty.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {files.map((file) => (
                <div 
                  key={file.id} 
                  style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    background: "rgba(255,255,255,0.03)", 
                    padding: "1rem", 
                    borderRadius: "12px",
                    border: "1px solid var(--glass-border)",
                    flexWrap: "wrap",
                    gap: "1rem"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: "1 1 200px" }}>
                    <div style={{ fontSize: "1.5rem" }}>📄</div>
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{file.originalName}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {(file.size / 1024).toFixed(1)} KB • {new Date(file.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "flex-start" }}>
                    <button 
                      onClick={() => handleDownload(file.id)}
                      className="link"
                      style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)", cursor: "pointer", fontSize: "0.825rem", padding: "0.5rem 0.75rem", borderRadius: "8px", textDecoration: "none" }}
                    >
                      Decrypt
                    </button>
                    <button 
                      onClick={() => window.open(`/api/files/raw?id=${file.id}`, "_blank")}
                      className="link"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", cursor: "pointer", fontSize: "0.825rem", padding: "0.5rem 0.75rem", borderRadius: "8px", textDecoration: "none", color: "var(--text-muted)" }}
                    >
                      View Raw
                    </button>
                    <button 
                      onClick={() => setDeleteModal({ show: true, fileId: file.id })}
                      className="link"
                      style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", cursor: "pointer", fontSize: "0.825rem", padding: "0.5rem 0.75rem", borderRadius: "8px", textDecoration: "none", color: "#ef4444" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteModal.show && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          animation: "fadeIn 0.2s ease"
        }}>
          <div className="glass-panel" style={{ maxWidth: "450px", textAlign: "center", padding: "2.5rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
            <h2 className="heading-main" style={{ fontSize: "1.5rem" }}>Confirm Deletion</h2>
            <p className="heading-sub" style={{ marginBottom: "2rem" }}>
              Are you sure you want to permanently delete this encrypted file? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button 
                className="btn-primary" 
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid var(--glass-border)", marginTop: 0 }}
                onClick={() => setDeleteModal({ show: false, fileId: null })}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                style={{ background: "#ef4444", marginTop: 0 }}
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? <span className="spinner"></span> : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
