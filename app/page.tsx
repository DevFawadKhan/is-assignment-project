"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// --- SVG Icons ---
const VaultIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 15v4" />
  </svg>
);
const SettingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);
const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);
const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);
const ShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" x2="12" y1="2" y2="15" />
  </svg>
);
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const FileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

interface UserInfo {
  name: string;
  email: string;
  role?: string;
  profileImage?: string | null;
}

interface EncryptedFile {
  id: number;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
  userId: number;
  recipientId: number | null;
  user?: UserInfo | null;
  recipient?: UserInfo | null;
}

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<EncryptedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{
    id: string | number;
    name: string;
    email: string;
    role?: string;
    profileImage?: string | null;
  } | null>(null);
  const [users, setUsers] = useState<
    { id: number; name: string; email: string }[]
  >([]);
  const [activeTab, setActiveTab] = useState<"vault" | "settings">("vault");

  // Profile Update States
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Custom Modal States
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    fileId: number | null;
  }>({
    show: false,
    fileId: null,
  });

  const [shareModal, setShareModal] = useState<{
    show: boolean;
    fileId: number | null;
  }>({
    show: false,
    fileId: null,
  });

  useEffect(() => {
    fetchFiles();
    fetchUser();
    fetchUsersList();
  }, []);

  const fetchUsersList = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (res.ok) setUsers(data.users);
    } catch (err) {
      console.error("Failed to fetch users list", err);
    }
  };

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
    const form = e.currentTarget;
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

      form.reset();
      fetchFiles();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleShowRaw = (fileId: number) => {
    window.open(`/api/files/raw?id=${fileId}`, "_blank");
  };

  const handleDownloadRaw = (fileId: number) => {
    window.location.href = `/api/files/raw?id=${fileId}&download=true`;
  };

  const handleShowDecrypted = (fileId: number) => {
    window.open(`/api/files/download?id=${fileId}&inline=true`, "_blank");
  };

  const handleDownloadDecrypted = (fileId: number) => {
    window.location.href = `/api/files/download?id=${fileId}`;
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

  const handleShare = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!shareModal.fileId) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const recipientId = formData.get("recipientId") as string;

    if (!recipientId) {
      alert("Please select a recipient.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/files/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: shareModal.fileId, recipientId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to share file");

      setShareModal({ show: false, fileId: null });
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
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("Failed to log out");
      router.push("/login");
    } catch (err) {
      console.error(err);
      alert("There was an error logging out.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setProfileLoading(true);
    setProfileMsg(null);

    try {
      const res = await fetch("/api/auth/update", {
        method: "POST",
        // Using native multipart/form-data implicitly configured by the browser
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      setProfileMsg({ type: "success", text: "Profile updated successfully." });
      setUser(data.user);
      form.reset();
    } catch (err: any) {
      setProfileMsg({ type: "error", text: err.message });
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="flex h-[100dvh] bg-bg-primary overflow-hidden w-full">
      {/* Sidebar Navigation */}
      <aside className="w-64 glass border-r border-glass-border/30 flex flex-col justify-between h-full relative z-10 shrink-0 shadow-2xl rounded-none">
        <div>
          <div className="p-6 flex items-center gap-3 border-b border-glass-border/20">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-accent-primary flex items-center justify-center text-text-main shadow-lg shadow-accent-primary/20 overflow-hidden">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserIcon />
              )}
            </div>
            <div className="overflow-hidden">
              <h2 className="font-bold text-text-main text-lg truncate leading-tight">
                {user ? user.name : "Loading..."}
              </h2>
              <p className="text-xs text-text-muted truncate">
                {user ? user.email : "..."}
              </p>
            </div>
          </div>

          <nav className="p-4 space-y-2 mt-4">
            <button
              onClick={() => setActiveTab("vault")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold ${activeTab === "vault" ? "bg-blue-50 text-blue-900 border border-blue-100 shadow-sm" : "text-text-muted hover:bg-black/5 hover:text-text-main border border-transparent"}`}
            >
              <VaultIcon />
              My Vault
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold ${activeTab === "settings" ? "bg-blue-50 text-blue-900 border border-blue-100 shadow-sm" : "text-text-muted hover:bg-black/5 hover:text-text-main border border-transparent"}`}
            >
              <SettingsIcon />
              Profile Settings
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-glass-border/20 space-y-2">
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm cursor-pointer mb-2"
            >
              <SettingsIcon />
              Admin Controls
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-error/10 hover:bg-error border border-error/20 hover:border-error text-error hover:text-text-main px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm hover:shadow-error/30 cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner w-[14px] h-[14px] !border-current border-text-main"></span>
            ) : (
              <>
                <LogoutIcon />
                Log Out
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-12 relative flex items-start justify-center">
        <div className="max-w-[1000px] w-full mx-auto animate-fade-in relative z-10 pt-4 pb-20">
          {activeTab === "vault" && (
            <div className="animate-slide-up space-y-8 w-full">
              <header className="mb-10">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-main mb-2 drop-shadow-sm">
                  Secure File Vault
                </h1>
                <p className="text-text-muted text-sm md:text-base">
                  Encrypt and upload your sensitive data with AES-256-GCM.
                </p>
              </header>

              {/* Upload Section */}
              <div className="glass p-6 md:p-8 rounded-[24px] border border-glass-border shadow-soft w-full bg-white">
                <h3 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
                  <UploadIcon /> Encrypt & Upload
                </h3>
                <form
                  onSubmit={handleFileUpload}
                  className="flex flex-col md:flex-row items-center gap-4"
                >
                  <div className="w-full relative flex-1 flex gap-2 flex-col sm:flex-row">
                    <input
                      type="file"
                      name="file"
                      className="w-full sm:w-1/2 p-4 bg-bg-secondary border border-glass-border rounded-xl text-text-main focus:border-accent-primary outline-none transition-all focus:ring-2 focus:ring-accent-primary/20 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
                      required
                      disabled={uploading}
                    />
                    <select
                      name="recipientId"
                      className="w-full sm:w-1/2 p-4 bg-bg-secondary border border-glass-border rounded-xl text-text-main focus:border-accent-primary outline-none transition-all focus:ring-2 focus:ring-accent-primary/20 cursor-pointer appearance-none"
                      disabled={uploading}
                    >
                      <option value="" className="bg-bg-primary text-text-main">
                        Private (Just me)
                      </option>
                      {users.map((u) => (
                        <option
                          key={u.id}
                          value={u.id}
                          className="bg-bg-primary text-text-main"
                        >
                          Share with: {u.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full md:w-auto shrink-0 bg-accent-primary hover:bg-accent-hover text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 shadow-md hover:shadow-accent-primary/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 h-[58px] cursor-pointer"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <span className="spinner w-[18px] h-[18px] border-text-main"></span>
                        Encrypting...
                      </>
                    ) : (
                      "Upload File"
                    )}
                  </button>
                </form>
                {error && (
                  <p className="text-error bg-error/10 p-4 rounded-xl border border-error/20 text-sm mt-6 font-medium animate-fade-in">
                    {error}
                  </p>
                )}
              </div>

              {/* Files Grid */}
              <div className="w-full">
                <h3 className="text-2xl font-bold text-text-main mb-6">
                  Your Encrypted Data
                </h3>
                {files.length === 0 ? (
                  <div className="glass bg-white p-12 rounded-[24px] border border-dashed border-glass-border text-center flex flex-col items-center justify-center opacity-70 w-full">
                    <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mb-4 text-text-muted">
                      <FileIcon />
                    </div>
                    <h4 className="text-lg font-bold text-text-main mb-1">
                      Vault is Empty
                    </h4>
                    <p className="text-text-muted text-sm max-w-sm">
                      You haven't uploaded any files yet. Use the area above to
                      securely upload your first file.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="glass bg-white p-6 rounded-[24px] border border-glass-border hover:border-accent-primary/30 hover:bg-bg-secondary transition-all duration-300 group flex flex-col items-start gap-4 shadow-sm w-full"
                      >
                        <div className="flex items-center gap-4 w-full">
                          <div className="w-12 h-12 shrink-0 bg-accent-primary/5 rounded-xl flex items-center justify-center text-text-main border border-glass-border group-hover:scale-110 transition-transform">
                            <FileIcon />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4
                              className="font-bold text-base text-text-main truncate pr-2"
                              title={file.originalName}
                            >
                              {file.originalName}
                            </h4>
                            <div className="text-xs text-text-muted mt-1 uppercase tracking-wider font-semibold">
                              {(file.size / 1024).toFixed(1)} KB •{" "}
                              {new Date(file.createdAt).toLocaleDateString()}
                            </div>
                            {file.recipientId && user && (
                              <div className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded border border-glass-border inline-block bg-black/5 text-text-main">
                                {file.userId === parseInt((user as any).id)
                                  ? `📤 Sent to: ${file.recipient?.name}`
                                  : `📥 Received from: ${file.user?.name}`}
                              </div>
                            )}
                            {!file.recipientId &&
                              user &&
                              file.userId === parseInt((user as any).id) && (
                                <div className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded border border-glass-border inline-block bg-black/5 text-text-muted">
                                  🔒 Private
                                </div>
                              )}
                          </div>
                        </div>

                        <div className="flex flex-wrap w-full gap-2 mt-2">
                          <button
                            onClick={() => handleDownloadRaw(file.id)}
                            className="flex items-center justify-center gap-1.5 flex-1 bg-black/5 border border-glass-border text-text-main text-[11px] font-bold px-3 py-2.5 rounded-lg hover:bg-black/10 transition-all cursor-pointer shadow-sm"
                          >
                            <DownloadIcon /> Raw
                          </button>

                          <button
                            onClick={() => handleDownloadDecrypted(file.id)}
                            className="flex items-center justify-center gap-1.5 flex-1 bg-accent-primary border border-accent-primary text-white text-[11px] font-bold px-3 py-2.5 rounded-lg hover:bg-accent-hover transition-all shadow-md hover:shadow-accent-primary/30 cursor-pointer"
                          >
                            <DownloadIcon /> Decrypt
                          </button>

                          <button
                            onClick={() =>
                              setDeleteModal({ show: true, fileId: file.id })
                            }
                            className="flex items-center justify-center shrink-0 w-10 bg-error/10 border border-error/20 text-error text-xs font-bold rounded-lg hover:bg-error hover:text-white transition-all cursor-pointer"
                            title="Delete File"
                          >
                            <TrashIcon />
                          </button>
                        </div>

                        {/* Dynamic Contextual Extrapolations: Render explicit sharing functionality to owners retaining isolated private payloads natively! */}
                        {!file.recipientId &&
                          user &&
                          file.userId === parseInt((user as any).id) && (
                            <div className="w-full pt-3 mt-1 border-t border-glass-border">
                              <button
                                onClick={() =>
                                  setShareModal({ show: true, fileId: file.id })
                                }
                                className="w-full flex items-center justify-center gap-2 bg-black/5 border border-glass-border text-text-main hover:bg-black/10 text-xs font-bold px-4 py-2.5 rounded-lg transition-all cursor-pointer shadow-sm"
                              >
                                <ShareIcon /> Share File
                              </button>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="animate-slide-up w-full max-w-2xl">
              <header className="mb-10">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-main mb-2 drop-shadow-sm">
                  Profile Settings
                </h1>
                <p className="text-text-muted text-sm md:text-base">
                  Update your personal information and rotate your password.
                </p>
              </header>

              <div className="glass bg-white p-6 md:p-10 rounded-[24px] border border-glass-border shadow-soft">
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="flex flex-col items-center mb-6">
                     <div className="w-24 h-24 rounded-2xl bg-black/5 flex items-center justify-center border border-glass-border mb-4 overflow-hidden relative group">
                        {user?.profileImage ? (
                           <img src={user.profileImage} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                           <UserIcon />
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                          <span className="text-white text-xs font-bold">Edit Profile</span>
                        </div>
                     </div>
                     <input type="file" name="profileImage" accept="image/*" className="text-sm text-text-muted file:bg-bg-secondary file:text-text-main file:border-none file:mr-4 file:py-2 file:px-4 file:rounded-xl hover:file:bg-black/5 cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text-muted mb-2 uppercase tracking-wide">
                      Display Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={user?.name}
                      placeholder="Enter your full name"
                      className="w-full p-4 bg-bg-secondary border border-glass-border rounded-xl text-text-main focus:border-accent-primary outline-none transition-all focus:ring-2 focus:ring-accent-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text-muted mb-2 uppercase tracking-wide">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Leave blank to keep current password"
                      className="w-full p-4 bg-bg-secondary border border-glass-border rounded-xl text-text-main focus:border-accent-primary outline-none transition-all focus:ring-2 focus:ring-accent-primary/20"
                    />
                  </div>

                  {profileMsg && (
                    <div
                      className={`p-4 rounded-xl text-sm font-bold animate-fade-in border ${profileMsg.type === "success" ? "bg-green-100 text-green-700 border-green-200" : "bg-error/10 text-error border-error/20"}`}
                    >
                      {profileMsg.text}
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-accent-primary hover:bg-accent-hover text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 shadow-md hover:shadow-accent-primary/40 disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
                      disabled={profileLoading}
                    >
                      {profileLoading ? (
                        <span className="spinner w-[18px] h-[18px] border-text-main"></span>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1000] animate-fade-in p-4">
          <div className="glass bg-white p-10 md:p-12 rounded-[32px] w-full max-w-[450px] text-center animate-slide-up border border-error/20 shadow-xl">
            <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-error/20 text-error">
              <TrashIcon />
            </div>
            <h2 className="text-2xl font-bold text-text-main mb-3">
              Permanently Delete?
            </h2>
            <p className="text-text-muted text-sm leading-relaxed mb-8">
              This action cannot be reversed. The encrypted blob will be
              destroyed and unrecoverable from the vault.
            </p>
            <div className="flex gap-4">
              <button
                className="flex-1 cursor-pointer bg-black/5 border border-glass-border text-text-main font-bold py-4 px-4 rounded-xl hover:bg-black/10 transition-all focus:ring-2 focus:ring-black/10"
                onClick={() => setDeleteModal({ show: false, fileId: null })}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="flex-1 cursor-pointer bg-error text-white font-bold py-4 px-4 rounded-xl hover:bg-red-600 transition-all shadow-md shadow-error/40 focus:ring-2 focus:ring-error/50"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner w-[18px] h-[18px] border-white"></span>
                ) : (
                  "Delete File"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal Execution Dialog */}
      {shareModal.show && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1000] animate-fade-in p-4">
          <div className="glass bg-white p-8 md:p-10 rounded-[32px] w-full max-w-[450px] text-center animate-slide-up shadow-xl border border-glass-border">
            <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-glass-border text-text-main">
              <ShareIcon />
            </div>
            <h2 className="text-xl font-bold text-text-main mb-2">
              Share Secure Payload
            </h2>
            <p className="text-text-muted text-sm leading-relaxed mb-6">
              Select a verified platform recipient to map this private encrypted
              blob to. They will instantly be authorized to download it.
            </p>

            <form onSubmit={handleShare} className="text-left w-full">
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wide">
                Target Recipient
              </label>
              <select
                name="recipientId"
                className="w-full p-4 bg-bg-secondary border border-glass-border rounded-xl text-text-main focus:border-accent-primary outline-none transition-all focus:ring-2 focus:ring-accent-primary/20 cursor-pointer appearance-none mb-6"
                required
                disabled={loading}
              >
                <option value="" disabled selected className="text-text-muted">
                  -- Select a registered team member --
                </option>
                {users.map((u) => (
                  <option
                    key={u.id}
                    value={u.id}
                    className="bg-bg-primary text-text-main"
                  >
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>

              <div className="flex gap-4">
                <button
                  type="button"
                  className="flex-1 cursor-pointer bg-black/5 border border-glass-border text-text-main font-bold py-3 px-4 rounded-xl hover:bg-black/10 transition-all focus:ring-2 focus:ring-black/10"
                  onClick={() => setShareModal({ show: false, fileId: null })}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 cursor-pointer bg-accent-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-accent-hover transition-all shadow-md shadow-accent-primary/40 focus:ring-2 focus:ring-accent-primary/50"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner w-[18px] h-[18px] border-white"></span>
                  ) : (
                    "Share Safely"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
