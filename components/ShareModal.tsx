import React from "react";
import { Share2 } from "lucide-react";

interface ShareModalProps {
  show: boolean;
  onClose: () => void;
  onShare: (e: React.FormEvent<HTMLFormElement>) => void;
  users: { id: number; name: string; email: string }[];
  loading: boolean;
}

export default function ShareModal({ show, onClose, onShare, users, loading }: ShareModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="glass bg-white p-8 md:p-10 rounded-[32px] w-full max-w-[450px] text-center animate-slide-up shadow-xl border border-glass-border">
        <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-glass-border text-text-main">
          <Share2 size={24} />
        </div>
        <h2 className="text-xl font-bold text-text-main mb-2">
          Share Secure Payload
        </h2>
        <p className="text-text-muted text-sm leading-relaxed mb-6">
          Select a verified platform recipient to map this private encrypted
          blob to. They will instantly be authorized to download it.
        </p>

        <form onSubmit={onShare} className="text-left w-full">
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
              onClick={onClose}
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
  );
}
