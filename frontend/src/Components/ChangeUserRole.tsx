import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import ROLE from "../Role/role";
import ApiSummary from "../BackendUrl/backendUrl";
import { toast } from "react-toastify";
import { FiShield } from "react-icons/fi";

interface ChangeUserRoleProps {
  name: string;
  email: string;
  role: string;
  onClose: () => void;
  userId: string;
  calFunc: () => void;
}

const ChangeUserRole: React.FC<ChangeUserRoleProps> = ({
  name,
  email,
  role,
  onClose,
  userId,
  calFunc,
}) => {
  const [userRole, setUserRole] = useState(role);
  const [loading, setLoading] = useState(false);

  const handleSelectOptions = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserRole(e.target.value);
  };

  const updateUserRole = async () => {
    try {
      setLoading(true);
      const fetchData = await fetch(ApiSummary.update_user.url, {
        method: ApiSummary.update_user.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          role: userRole,
          userId: userId,
        }),
      });
      const responseData = await fetchData.json();
      if (responseData.success) {
        toast.success(responseData.message || "User role updated successfully");
        onClose();
        calFunc();
      } else {
        toast.error(responseData.message || "Failed to update user role");
      }
    } catch (err) {
      console.error("Error updating user role:", err);
      toast.error("Network error while updating user role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-base">
              <FiShield />
            </div>
            <h3 className="text-base font-bold text-slate-900">Change User Role</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <IoMdClose className="text-lg" />
          </button>
        </div>

        {/* User Details */}
        <div className="py-5 space-y-3">
          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <p className="text-xs text-slate-500">
              User: <span className="font-semibold text-slate-800">{name}</span>
            </p>
            <p className="text-xs text-slate-500 font-mono">
              Email: <span className="text-slate-700">{email}</span>
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600" htmlFor="role-select">
              Assign Role:
            </label>
            <select
              id="role-select"
              value={userRole}
              onChange={handleSelectOptions}
              className="border border-slate-200 bg-white px-3 py-2 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10"
            >
              {Object.values(ROLE).map((val, i) => (
                <option value={val} key={i}>
                  {val}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={updateUserRole}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Save Role"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeUserRole;
