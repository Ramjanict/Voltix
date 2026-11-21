import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { FiUsers, FiPackage, FiShield, FiUser } from "react-icons/fi";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import ROLE from "../Role/role";
import { RootState } from "../store/store";

const AdminPanel: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role && user.role !== ROLE.ADMIN) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-50 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between p-4 shadow-sm hidden md:flex">
        <div>
          {/* Admin Profile Card */}
          <div className="p-4 bg-gradient-to-br from-indigo-50/80 to-purple-50/50 rounded-2xl border border-indigo-100/60 mb-6 text-center">
            <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 border-2 border-white shadow-md bg-white flex items-center justify-center">
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  className="w-full h-full object-cover"
                  alt={user?.name}
                />
              ) : (
                <FiUser className="text-2xl text-indigo-600" />
              )}
            </div>
            <h3 className="font-bold text-slate-800 text-sm capitalize truncate">
              {user?.name || "Administrator"}
            </h3>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            <div className="inline-flex items-center gap-1 mt-2 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              <FiShield className="text-[10px]" />
              Admin
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5">
            <NavLink
              to={"all-products"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <FiPackage className="text-base" />
              <span>Products Catalog</span>
            </NavLink>

            <NavLink
              to={"all-users"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <FiUsers className="text-base" />
              <span>Manage Users</span>
            </NavLink>
          </nav>
        </div>

        {/* Sidebar Footer info */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
          <p className="text-[11px] font-semibold text-slate-700">Voltix Admin Suite</p>
          <p className="text-[10px] text-slate-400">PostgreSQL + Prisma</p>
        </div>
      </aside>

      {/* Main Admin Outlet */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
