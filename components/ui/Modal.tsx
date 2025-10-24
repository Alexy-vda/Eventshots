"use client";

import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  actions,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4">{title}</h3>
        <div className="text-[#666] mb-6">{children}</div>
        {actions && <div className="flex gap-3">{actions}</div>}
      </div>
    </div>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "primary";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  isLoading = false,
  variant = "danger",
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      actions={
        <>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-[#fafafa] rounded-md text-[#1a1a1a] font-medium hover:bg-[#f0f0f0] disabled:opacity-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 text-white rounded-md font-medium disabled:cursor-not-allowed transition-colors ${
              variant === "danger"
                ? "bg-[#ef4444] hover:bg-[#dc2626] disabled:bg-[#fca5a5]"
                : "bg-[#6366f1] hover:bg-[#4f46e5] disabled:bg-[#a5b4fc]"
            }`}
          >
            {isLoading ? "Chargement..." : confirmText}
          </button>
        </>
      }
    >
      <p>{message}</p>
    </Modal>
  );
}
