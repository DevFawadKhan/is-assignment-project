import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { User as UserIcon } from "lucide-react";

interface SettingsProps {
  user: any;
  onUpdate: (updatedUser: any) => void;
}

export default function Settings({ user, onUpdate }: SettingsProps) {
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setProfileLoading(true);
    setProfileMsg(null);

    try {
      const res = await axios.patch("/api/auth/update", formData);
      toast.success("Profile updated successfully!");
      setProfileMsg({ type: "success", text: "Profile updated successfully." });
      onUpdate(res.data.user);
      form.reset();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Update failed";
      setProfileMsg({ type: "error", text: msg });
      toast.error(msg);
    } finally {
      setProfileLoading(false);
    }
  };

  return (
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
            <div className="w-20 h-20 rounded-2xl bg-black/5 border border-glass-border flex items-center justify-center text-text-muted overflow-hidden shadow-inner relative group">
              {user?.profileImage &&
              !user.profileImage.toLowerCase().includes("javascript:") &&
              !user.profileImage.toLowerCase().includes("vbscript:") &&
              !user.profileImage.toLowerCase().includes("data:text/html") ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon size={32} />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                <span className="text-white text-xs font-bold">Edit Profile</span>
              </div>
            </div>
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              className="text-sm text-text-muted file:bg-bg-secondary file:text-text-main file:border-none file:mr-4 file:py-2 file:px-4 file:rounded-xl hover:file:bg-black/5 cursor-pointer mt-4"
            />
            <p className="text-xs text-text-muted mt-3 font-semibold uppercase tracking-wider">
              Member since {new Date(user?.createdAt).toLocaleDateString()}
            </p>
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
              className={`p-4 rounded-xl text-sm font-bold animate-fade-in border ${
                profileMsg.type === "success"
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-error/10 text-error border-error/20"
              }`}
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
  );
}
