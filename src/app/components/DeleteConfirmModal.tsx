"use client";
import { useEffect } from "react";

interface DeleteConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex justify-center items-center px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">
          Confirm Deletion
        </h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this lesson? This action cannot be
          undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md border text-gray-400 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-[#23BAD8] hover:bg-cyan-600 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
