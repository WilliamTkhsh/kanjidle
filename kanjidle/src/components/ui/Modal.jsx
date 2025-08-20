import React from "react";

export default function Modal ({ open, onClose, children, className = "" }) {
  if (!open) return null;
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onMouseDown={handleBackdrop}>
      <div className={className}>{children}</div>
    </div>
  );
};