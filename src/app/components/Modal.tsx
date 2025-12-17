"use client";

export default function Modal({ children, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl font-bold text-gray-600 hover:text-black"
        >
          ×
        </button>

        {children}
      </div>
    </div>
  );
}
