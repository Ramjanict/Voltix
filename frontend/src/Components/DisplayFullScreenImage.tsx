import React from "react";
import { CgClose } from "react-icons/cg";

interface DisplayFullScreenImageProps {
  onClose: () => void;
  imgeUrl: string;
}

const DisplayFullScreenImage: React.FC<DisplayFullScreenImageProps> = ({ onClose, imgeUrl }) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[999]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl p-4 shadow-2xl max-w-2xl max-h-[85vh] flex flex-col items-center overflow-hidden animate-in fade-in zoom-in duration-200"
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors z-10"
        >
          <CgClose className="text-lg" />
        </button>
        <div className="p-2 flex items-center justify-center overflow-hidden">
          <img
            className="max-h-[75vh] w-auto object-contain rounded-xl"
            src={imgeUrl}
            alt="Full Preview"
          />
        </div>
      </div>
    </div>
  );
};

export default DisplayFullScreenImage;
