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
  const [user, setUser] = useState<{ name: string } | null>(null);
  
  // Custom Modal States
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; fileId: number | null }>({
    show: false,
    fileId: null,
  });

  useEffect(() => {
    fetchFiles();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
      }
    } catch (err) {
      console.error("Failed to fetch user info", err);
    }
  };

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
    <div className="flex flex-col gap-8 min-h-screen items-center py-16 px-8 md:px-12">
      <div className="glass p-8 md:p-12 rounded-[24px] w-full max-w-[1000px] relative animate-slide-up">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
          <div className="flex-1 min-w-[250px]">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-0">Secure File Vault</h1>
            <p className="text-text-muted text-sm md:text-base font-bold text-white mt-1">
              {user ? `Welcome, ${user.name}` : "You are securely authenticated."}
            </p>
          </div>
          <button 
            onClick={handleLogout} 
            className="btn-primary flex items-center justify-center bg-error hover:bg-red-600 px-4 py-2 text-sm min-w-[100px] w-auto mt-0 transition-all duration-200"
            disabled={loading}
          >
            {loading ? <span className="spinner w-[14px] h-[14px]"></span> : "Log Out"}
          </button>
        </div>

        <p className="text-text-muted text-sm md:text-base mb-10 leading-relaxed">
          Upload sensitive files to encrypt them with AES-256-GCM.
        </p>

        {/* Upload Section */}
        <div className="mt-8 p-6 bg-black/20 rounded-xl border border-dashed border-glass-border mb-8 animate-fade-in">
          <h3 className="text-lg font-semibold text-white mb-4">Encrypt & Upload File</h3>
          <form onSubmit={handleFileUpload} className="flex flex-wrap items-center gap-4">
            <input 
              type="file" 
              name="file" 
              className="flex-1 min-w-[300px] p-3 bg-input-bg border border-glass-border rounded-xl text-text-main focus:border-accent-primary outline-none transition-all" 
              required 
              disabled={uploading}
            />
            <button 
              type="submit" 
              className="bg-accent-primary hover:bg-accent-hover text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-accent-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed w-auto mt-0"
              disabled={uploading}
            >
              {uploading ? (
                <div className="flex items-center gap-2">
                  <span className="spinner"></span>
                  <span>Encrypting...</span>
                </div>
              ) : (
                "Upload"
              )}
            </button>
          </form>
          {error && <p className="text-error bg-error/10 p-3 rounded-lg border border-error/20 text-sm mt-4 animate-fade-in">{error}</p>}
        </div>

        {/* Files List */}
        <div className="mt-8 p-6 bg-black/20 rounded-xl border border-dashed border-glass-border animate-fade-in">
          <h3 className="text-lg font-semibold text-white mb-4">Your Encrypted Files</h3>
          {files.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-4">
              No encrypted files found. Your vault is currently empty.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {files.map((file) => (
                <div 
                  key={file.id} 
                  className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white/5 border border-glass-border rounded-xl hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                    <div className="text-2xl">📄</div>
                    <div className="overflow-hidden">
                      <div className="font-semibold text-sm md:text-base text-white truncate">{file.originalName}</div>
                      <div className="text-[10px] md:text-xs text-text-muted mt-0.5 uppercase tracking-wider">
                        {(file.size / 1024).toFixed(1)} KB • {new Date(file.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-start">
                    <button 
                      onClick={() => handleDownload(file.id)}
                      className="bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-semibold px-3 py-2 rounded-lg hover:bg-accent-primary/20 transition-all"
                    >
                      Decrypt
                    </button>
                    <button 
                      onClick={() => window.open(`/api/files/raw?id=${file.id}`, "_blank")}
                      className="bg-white/5 border border-glass-border text-text-muted text-xs font-semibold px-3 py-2 rounded-lg hover:bg-white/10 transition-all"
                    >
                      View Raw
                    </button>
                    <button 
                      onClick={() => setDeleteModal({ show: true, fileId: file.id })}
                      className="bg-error/10 border border-error/20 text-error text-xs font-semibold px-3 py-2 rounded-lg hover:bg-error/20 transition-all"
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1000] animate-fade-in p-4">
          <div className="glass p-10 md:p-12 rounded-[24px] w-full max-w-[450px] text-center animate-slide-up">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Confirm Deletion</h2>
            <p className="text-text-muted text-sm leading-relaxed mb-8">
              Are you sure you want to permanently delete this encrypted file? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button 
                className="flex-1 bg-white/10 border border-glass-border text-white font-semibold py-3 px-4 rounded-xl hover:bg-white/20 transition-all"
                onClick={() => setDeleteModal({ show: false, fileId: null })}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className="flex-1 bg-error text-white font-semibold py-3 px-4 rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-error/30"
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
