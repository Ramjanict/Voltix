import React, { useContext, useState } from "react";
import { GrSearch } from "react-icons/gr";
import { FaShoppingCart } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { MdOutlineDashboard, MdOutlineShoppingBag, MdLogout } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ApiSummary from "../BackendUrl/backendUrl";
import { toast } from "react-toastify";
import { setUserDetails } from "../store/userSlice";
import ROLE from "../Role/role";
import ContextApi from "../Context/Contex";
import { RootState } from "../store/store";

const Header: React.FC = () => {
  const [displayMenu, setDisplayMenu] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const { cartProductCount } = useContext(ContextApi);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [search, setSearch] = useState(searchParams.get("q") || "");

  const handleLogout = async () => {
    try {
      const responseData = await fetch(ApiSummary.logout_user.url, {
        credentials: "include",
      });
      const data = await responseData.json();
      if (data.success) {
        toast.success(data.message || "Logged out");
        dispatch(setUserDetails(null));
        setDisplayMenu(false);
        navigate("/");
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value.trim())}`);
    } else {
      navigate("/search");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 z-50 shadow-xs">
      <div className="container mx-auto h-full flex items-center justify-between px-4 sm:px-6 gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <HiSparkles className="text-xl" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent">
              VOLTIX
            </span>
            <span className="text-[10px] block font-semibold text-indigo-600 -mt-1 tracking-widest uppercase">
              ElectroMart
            </span>
          </div>
        </Link>

        {/* Navigation links & Search */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <Link to="/" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <Link to="/product-category" className="hover:text-indigo-600 transition-colors">
            All Products
          </Link>
        </div>

        {/* Modern Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md items-center relative">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <GrSearch className="text-base" />
            </div>
            <input
              type="text"
              placeholder="Search gadgets, audio, laptops, phones..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100/90 border border-transparent rounded-full text-sm text-slate-800 placeholder-slate-400 transition-all outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-inner"
              value={search}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative p-2.5 rounded-full text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
            title="Shopping Cart"
          >
            <FaShoppingCart className="text-xl" />
            {cartProductCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md shadow-indigo-600/30 animate-pulse">
                {cartProductCount > 99 ? "99+" : cartProductCount}
              </span>
            )}
          </Link>

          {/* User Account / Profile */}
          {user && (user.id || user._id) ? (
            <div className="relative">
              <button
                onClick={() => setDisplayMenu((prev) => !prev)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
              >
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-600/20"
                    alt={user.name || "User"}
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm ring-2 ring-indigo-600/20">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </button>

              {/* Profile Dropdown Menu */}
              {displayMenu && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-800 line-clamp-1">
                      {user.name || "Customer"}
                    </p>
                    <p className="text-xs text-slate-400 line-clamp-1">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      {user.role || "GENERAL"}
                    </span>
                  </div>

                  <div className="py-1 text-sm text-slate-700">
                    {user.role === ROLE.ADMIN && (
                      <Link
                        to="/admin-panel/all-products"
                        onClick={() => setDisplayMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 transition-colors font-medium text-slate-700 hover:text-indigo-600"
                      >
                        <MdOutlineDashboard className="text-lg" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/order"
                      onClick={() => setDisplayMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 transition-colors font-medium text-slate-700 hover:text-indigo-600"
                    >
                      <MdOutlineShoppingBag className="text-lg" />
                      My Orders
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                      <MdLogout className="text-lg" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 rounded-full hover:bg-slate-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-indigo-600 rounded-full shadow-sm hover:shadow-indigo-500/20 transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
