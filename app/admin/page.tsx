"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import axios from "axios";
import { 
  ShieldCheck, 
  Lock, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Edit, 
  ArrowLeft,
  Users,
  Database
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"users" | "files">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users");
      setUsers(res.data.users);
    } catch(err: any) { 
      setError(err.response?.data?.message || err.message); 
    }
  };

  const fetchFiles = async () => {
    try {
      const res = await axios.get("/api/admin/files");
      setFiles(res.data.files);
    } catch(err: any) { 
      setError(err.response?.data?.message || err.message); 
    }
  };

  useEffect(() => {
    axios.get("/api/auth/me").then(res => {
      const data = res.data;
      if (!data.user || data.user.role !== "ADMIN") {
        router.push("/");
      } else {
        fetchUsers();
        fetchFiles();
        setLoading(false);
      }
    }).catch(() => {
      router.push("/");
    });
  }, [router]);

  const toggleBlock = async (id: number, currentStatus: boolean) => {
    try {
      await axios.patch(`/api/admin/users/${id}`, { isBlocked: !currentStatus });
      toast.success(`User ${currentStatus ? "unblocked" : "blocked"} successfully.`);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update user status.");
    }
  };

  const deleteUser = async (id: number) => {
    if(!confirm("Are you sure? This deletes the user and all their encrypted files permanently.")) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      toast.success("User and associated files deleted.");
      fetchUsers();
      fetchFiles();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete user.");
    }
  };

  const deleteFile = async (id: number) => {
    if(!confirm("Are you sure? This destroys the payload definitively.")) return;
    try {
      await axios.delete(`/api/admin/files/${id}`);
      toast.success("Encrypted payload purged definitively.");
      fetchFiles();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to purge file.");
    }
  };

  const updateUserDetails = async (id: number) => {
    const newName = prompt("Enter new Name (leave blank to skip):");
    const newEmail = prompt("Enter new Email (leave blank to skip):");
    const newPassword = prompt("Enter new Password (6 chars min, leave blank to skip):");
    
    const payload: any = {};
    if (newName) payload.name = newName;
    if (newEmail) payload.email = newEmail;
    if (newPassword) payload.password = newPassword;

    if (Object.keys(payload).length === 0) return;

    try {
      await axios.patch(`/api/admin/users/${id}`, payload);
      toast.success("User details updated successfully.");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update user.");
    }
  };

  if (loading) return <div className="min-h-screen bg-bg-primary flex items-center justify-center text-text-main font-bold">Verifying Admin Access...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary p-8 w-full max-w-7xl mx-auto animate-fade-in">
      <header className="flex justify-between items-center mb-10 pb-6 border-b border-glass-border">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-main">Admin Command Center</h1>
          <p className="text-text-muted mt-2">Manage infrastructure, modify user capabilities, and govern payloads.</p>
        </div>
        <Link href="/" className="flex items-center gap-2 px-6 py-3 bg-black/5 hover:bg-black/10 border border-glass-border text-text-main rounded-xl font-bold transition-all shadow-sm">
          <ArrowLeft size={18} /> Return to Vault
        </Link>
      </header>

      {error && <div className="p-4 bg-error/10 border border-error/20 text-error mb-8 rounded-xl font-bold text-sm">{error}</div>}

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab("users")} 
          className={`flex items-center gap-2 px-6 py-3 font-bold rounded-xl transition-all ${activeTab === "users" ? "bg-accent-primary text-white shadow-md shadow-accent-primary/20" : "bg-black/5 text-text-muted hover:text-text-main hover:bg-black/10"}`}
        >
          <Users size={18} /> User Topologies ({users.length})
        </button>
        <button 
          onClick={() => setActiveTab("files")} 
          className={`flex items-center gap-2 px-6 py-3 font-bold rounded-xl transition-all ${activeTab === "files" ? "bg-accent-primary text-white shadow-md shadow-accent-primary/20" : "bg-black/5 text-text-muted hover:text-text-main hover:bg-black/10"}`}
        >
          <Database size={18} /> Encrypted Payload Index ({files.length})
        </button>
      </div>

      <main className="bg-white rounded-3xl border border-glass-border shadow-soft overflow-hidden">
        {activeTab === "users" && (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-secondary border-b border-glass-border">
                  <th className="p-4 font-bold text-xs uppercase tracking-widest text-text-muted">ID / Identity</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-widest text-text-muted">Metrics</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-widest text-text-muted">Status</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-widest text-text-muted text-right">Overrides</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border/50">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-bg-secondary/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-black/5 border border-glass-border/50 flex shrink-0 items-center justify-center">
                          {u.profileImage && !u.profileImage.toLowerCase().includes("javascript:") && !u.profileImage.toLowerCase().includes("vbscript:") && !u.profileImage.toLowerCase().includes("data:text/html") ? <img src={u.profileImage} className="w-full h-full object-cover"/> : <span className="text-text-muted text-sm font-bold">{u.name.charAt(0)}</span>}
                        </div>
                        <div>
                          <div className="font-bold text-text-main flex items-center gap-2">
                             {u.name} {u.role === "ADMIN" && <span className="flex items-center gap-1 bg-accent-primary text-white text-[10px] px-1.5 py-0.5 rounded"><ShieldCheck size={10} /> ADMIN</span>}
                          </div>
                          <div className="text-xs text-text-muted">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-semibold text-text-main">
                      <div className="flex gap-2">
                         <span className="flex items-center gap-1 bg-black/5 px-2 py-1 rounded border border-glass-border"><ArrowUp size={12} className="text-accent-primary" /> Sent: {u._count.sentFiles}</span>
                         <span className="flex items-center gap-1 bg-black/5 px-2 py-1 rounded border border-glass-border"><ArrowDown size={12} className="text-emerald-600" /> Recv: {u._count.receivedFiles}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {u.isBlocked ? (
                         <span className="text-xs font-bold bg-error/10 text-error border border-error/20 px-2 py-1 rounded-md">Suspended</span>
                      ) : (
                         <span className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-md">Active</span>
                      )}
                    </td>
                    <td className="p-4 flex gap-2 justify-end">
                      {u.role !== "ADMIN" && (
                         <>
                           <button onClick={() => toggleBlock(u.id, u.isBlocked)} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${u.isBlocked ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'}`}>
                             {u.isBlocked ? "Unblock" : "Block"}
                           </button>
                           <button onClick={() => updateUserDetails(u.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-black/5 text-text-main border border-glass-border hover:bg-black/10 transition-all">
                             <Edit size={12} /> Modify
                           </button>
                           <button onClick={() => deleteUser(u.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-error/10 text-error border border-error/20 hover:bg-error hover:text-white transition-all">
                             <Trash2 size={12} /> Destroy
                           </button>
                         </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "files" && (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-secondary border-b border-glass-border">
                  <th className="p-4 font-bold text-xs uppercase tracking-widest text-text-muted">Payload</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-widest text-text-muted">Owner</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-widest text-text-muted">Recipient Constraint</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-widest text-text-muted text-right">Intervention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border/50">
                {files.map(f => (
                  <tr key={f.id} className="hover:bg-bg-secondary/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-sm text-text-main truncate max-w-[200px]">{f.originalName}</div>
                      <div className="text-xs text-text-muted mt-0.5">{(f.size / 1024).toFixed(1)} KB • {new Date(f.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4 text-sm text-text-main font-semibold">
                      {f.user?.name || "System"}
                    </td>
                    <td className="p-4 text-sm text-text-main">
                       {f.recipient ? <span className="bg-black/5 px-2 py-1 rounded border border-glass-border font-semibold text-xs">{f.recipient.name}</span> : <span className="flex items-center gap-1 text-text-muted font-bold text-xs"><Lock size={12} /> Private Network</span>}
                    </td>
                    <td className="p-4 text-right">
                       <button onClick={() => deleteFile(f.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-error/10 text-error border border-error/20 hover:bg-error hover:text-white transition-all ml-auto">
                        <Trash2 size={12} /> Purge
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
