"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Upload,
  Eye,
  Download,
  Trash2,
  Share2,
  File,
  ArrowUpRight,
  ArrowDownLeft,
  Lock,
} from "lucide-react";
import DeleteModal from "@/components/DeleteModal";
import ShareModal from "@/components/ShareModal";
import Sidebar from "@/components/Sidebar";
import Settings from "@/components/Settings";
// --- Icon Helper Wrappers ---
const UploadIcon = () => <Upload size={20} />;
const EyeIcon = () => <Eye size={16} />;
const DownloadIcon = () => <Download size={16} />;
const TrashIcon = () => <Trash2 size={16} />;
const ShareIcon = () => <Share2 size={16} />;
const FileIcon = () => <File size={24} />;

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      const res = await axios.get("/api/users");
      setUsers(res.data.users);
    } catch (err) {
      console.error("Failed to fetch users list", err);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/auth/me");
      setUser(res.data.user);
    } catch (err) {
      console.error("Failed to fetch user info", err);
    }
  };

  const fetchFiles = async () => {
    try {
      const res = await axios.get("/api/files");
      setFiles(res.data.files);
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
      await axios.post("/api/files/upload", formData);

      toast.success("File uploaded and encrypted successfully!");
      form.reset();
      fetchFiles();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Upload failed";
      setError(msg);
      toast.error(msg);
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
      await axios.delete(`/api/files/delete?id=${deleteModal.fileId}`);

      toast.success("File permanently deleted.");
      setDeleteModal({ show: false, fileId: null });
      fetchFiles();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Delete failed");
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
      await axios.post("/api/files/share", {
        fileId: shareModal.fileId,
        recipientId,
      });

      toast.success("File shared successfully!");
      setShareModal({ show: false, fileId: null });
      fetchFiles();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to share file");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.post("/api/auth/logout");
      toast.success("Logged out successfully.");
      router.push("/login");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "There was an error logging out.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-dvh bg-bg-primary overflow-hidden w-full relative">
      <Sidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
        loading={loading}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-12 relative flex items-start justify-center pt-24 lg:pt-12">
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
                              <div className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded border border-glass-border flex items-center gap-1 bg-black/5 text-text-main w-fit">
                                {file.userId === parseInt((user as any).id) ? (
                                  <>
                                    <ArrowUpRight size={12} strokeWidth={3} />{" "}
                                    Sent to: {file.recipient?.name}
                                  </>
                                ) : (
                                  <>
                                    <ArrowDownLeft size={12} strokeWidth={3} />{" "}
                                    Received from: {file.user?.name}
                                  </>
                                )}
                              </div>
                            )}
                            {!file.recipientId &&
                              user &&
                              file.userId === parseInt((user as any).id) && (
                                <div className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded border border-glass-border flex items-center gap-1 bg-black/5 text-text-muted w-fit">
                                  <Lock size={12} strokeWidth={3} /> Private
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
            <Settings
              user={user}
              onUpdate={(updatedUser) => setUser(updatedUser)}
            />
          )}
        </div>
      </main>

      <DeleteModal
        show={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, fileId: null })}
        onConfirm={handleDelete}
        loading={loading}
      />

      <ShareModal
        show={shareModal.show}
        onClose={() => setShareModal({ show: false, fileId: null })}
        onShare={handleShare}
        users={users}
        loading={loading}
      />
    </div>
  );
}
