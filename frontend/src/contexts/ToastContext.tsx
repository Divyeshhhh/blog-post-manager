import React, { createContext, useContext, useMemo, useState } from "react";

export type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (
    message: string,
    variant?: ToastVariant,
    durationMs?: number,
  ) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showToast = (
    message: string,
    variant: ToastVariant = "info",
    durationMs = 4000,
  ) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, variant }]);
    window.setTimeout(() => removeToast(id), durationMs);
  };

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed right-4 z-[9999] flex flex-col gap-3"
        style={{ bottom: '2cm' }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-[240px] max-w-sm rounded-2xl px-4 py-3 shadow-lg text-white backdrop-blur-md
              ${
                toast.variant === "success"
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                  : toast.variant === "error"
                    ? "bg-gradient-to-r from-rose-500 to-rose-600"
                    : "bg-gradient-to-r from-slate-600 to-slate-700"
              }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-xl">
                {toast.variant === "success"
                  ? "✅"
                  : toast.variant === "error"
                    ? "⚠️"
                    : "ℹ️"}
              </span>
              <p className="text-sm font-medium leading-snug">
                {toast.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
