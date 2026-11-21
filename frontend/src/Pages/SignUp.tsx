import React, { useState } from "react";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCamera, FiUserPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import imageTobase64 from "../../helper/ImageToBase64";
import { toast } from "react-toastify";
import ApiSummary from "../BackendUrl/backendUrl";

const SignUp: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: "",
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadPic = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imagePic = await imageTobase64(file);
      setData((prev) => ({ ...prev, profilePic: imagePic }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const postData = await fetch(`${ApiSummary.signup.url}`, {
        method: ApiSummary.signup.method,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await postData.json();

      if (responseData.success) {
        toast.success(responseData.message || "Account created successfully!");
        navigate("/login");
      } else {
        toast.error(responseData.message || "Registration failed. Try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Failed to connect to server. Please ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-slate-50/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-xl p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="relative w-24 h-24 mx-auto mb-3">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-200 bg-slate-100 flex items-center justify-center shadow-inner">
              {data.profilePic ? (
                <img
                  src={data.profilePic}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiUser className="text-4xl text-slate-400" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full cursor-pointer shadow-md transition-transform hover:scale-110 active:scale-95">
              <FiCamera className="text-sm" />
              <input type="file" accept="image/*" hidden onChange={handleUploadPic} />
            </label>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Create an Account
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Join Voltix to discover premium electronics & gadgets
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="name">
              Full Name
            </label>
            <div className="relative rounded-xl border border-slate-200 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600/10 transition-all bg-slate-50/50">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiUser />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={data.name}
                onChange={handleOnChange}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Email Address */}
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

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="password">
              Password
            </label>
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

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative rounded-xl border border-slate-200 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600/10 transition-all bg-slate-50/50">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiLock />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={data.confirmPassword}
                onChange={handleOnChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-200 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            <FiUserPlus />
            <span>{loading ? "Registering..." : "Create Account"}</span>
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
