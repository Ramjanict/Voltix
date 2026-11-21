import React from "react";

interface LogoProps {
  w?: number | string;
  h?: number | string;
}

const Logo: React.FC<LogoProps> = ({ w, h }) => {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
        <svg
          className="w-5 h-5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      </div>
      <div>
        <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1">
          VOLTIX
        </span>
        <span className="text-[10px] tracking-widest text-indigo-600 font-bold uppercase block -mt-1">
          Electromart
        </span>
      </div>
    </div>
  );
};

export default Logo;
