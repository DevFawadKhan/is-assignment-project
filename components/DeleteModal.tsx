import React from "react";
import { Trash2 } from "lucide-react";

interface DeleteModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export default function DeleteModal({ show, onClose, onConfirm, loading }: DeleteModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="glass bg-white p-10 md:p-12 rounded-[32px] w-full max-w-[450px] text-center animate-slide-up border border-error/20 shadow-xl">
        <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-error/20 text-error">
          <Trash2 size={32} />
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
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="flex-1 cursor-pointer bg-error text-white font-bold py-4 px-4 rounded-xl hover:bg-red-600 transition-all shadow-md shadow-error/40 focus:ring-2 focus:ring-error/50"
            onClick={onConfirm}
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
  );
}
