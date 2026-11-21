import React, { useContext, useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import ApiSummary from "../BackendUrl/backendUrl";
import { toast } from "react-toastify";
import ContextApi from "../Context/Contex";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { fetchUserDetails, fetchAddToCart } = useContext(ContextApi);
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFillDemoAdmin = () => {
    setData({
      email: "md@gmail.com",
      password: "12345",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const postData = await fetch(`${ApiSummary.login.url}`, {
        method: ApiSummary.login.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await postData.json();

      if (responseData.success) {
        toast.success(responseData.message || "Welcome back!");
        await fetchUserDetails();
        await fetchAddToCart();
        navigate("/");
      } else {
        toast.error(responseData.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Network error. Please make sure the backend is active.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-slate-50/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-xl p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-600/30 text-2xl mb-4">
            <FiLogIn />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome back
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Sign in to access your cart, orders, and wishlist
          </p>
        </div>

        {/* Demo Account Banner */}
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3.5 mb-6 text-xs text-indigo-900 flex items-center justify-between">
          <div>
            <p className="font-semibold">Quick Demo Login (Admin):</p>
            <p className="text-indigo-600 font-mono text-[11px]">md@gmail.com / 12345</p>
          </div>
          <button
            type="button"
            onClick={handleFillDemoAdmin}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
          >
            Auto-fill
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="email">
              Email Address
            </label>
            <div className="relative rounded-xl border border-slate-200 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600/10 transition-all bg-slate-50/50">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiMail />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={data.email}
                onChange={handleOnChange}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600" htmlFor="password">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative rounded-xl border border-slate-200 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600/10 transition-all bg-slate-50/50">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiLock />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={data.password}
                onChange={handleOnChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-200 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign in to account"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-slate-500">
          Don't have an account yet?{" "}
          <Link
            to="/sign-up"
            className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
