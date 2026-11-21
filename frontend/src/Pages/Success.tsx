import React from "react";
import { FiCheckCircle, FiArrowRight, FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";

const Success: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-slate-50/60 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-xl p-8 sm:p-10 text-center animate-in fade-in zoom-in duration-300">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl shadow-lg shadow-emerald-500/10 border border-emerald-100">
          <FiCheckCircle />
        </div>

        <span className="bg-emerald-100/70 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Payment Confirmed
        </span>

        <h1 className="text-2xl font-extrabold text-slate-900 mt-3 mb-2 tracking-tight">
          Thank you for your order!
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed mb-8">
          Your payment via Stripe was processed successfully. A confirmation receipt has been sent to your email.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            to="/order"
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-200 active:scale-98 text-sm"
          >
            <FiShoppingBag />
            <span>View My Orders</span>
            <FiArrowRight className="text-xs" />
          </Link>

          <Link
            to="/"
            className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-colors text-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
