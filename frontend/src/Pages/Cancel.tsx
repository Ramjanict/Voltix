import React from "react";
import { FiAlertCircle, FiArrowLeft, FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";

const Cancel: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-slate-50/60 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-xl p-8 sm:p-10 text-center animate-in fade-in zoom-in duration-300">
        {/* Cancel Icon */}
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl shadow-lg shadow-rose-500/10 border border-rose-100">
          <FiAlertCircle />
        </div>

        <span className="bg-rose-100/70 text-rose-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Payment Cancelled
        </span>

        <h1 className="text-2xl font-extrabold text-slate-900 mt-3 mb-2 tracking-tight">
          Checkout Was Cancelled
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed mb-8">
          No charges were applied to your card. Your cart items are still safely saved whenever you are ready to complete your purchase.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            to="/cart"
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-200 active:scale-98 text-sm"
          >
            <FiShoppingCart />
            <span>Return to Cart</span>
          </Link>

          <Link
            to="/"
            className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-colors text-sm"
          >
            <FiArrowLeft className="text-xs" />
            <span>Back to Store</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cancel;
