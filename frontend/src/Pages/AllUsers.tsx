import React, { useEffect, useState } from "react";
import ApiSummary from "../BackendUrl/backendUrl";
import { toast } from "react-toastify";
import moment from "moment";
import { FiEdit2, FiShield, FiUser } from "react-icons/fi";
import ChangeUserRole from "../Components/ChangeUserRole";
import { User } from "../types";

const AllUsers: React.FC = () => {
  const [allusers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openUpdateRole, setOpenUpdateRole] = useState(false);
  const [updateUserDetails, setUpdateUserDetails] = useState<{
    email: string;
    name: string;
    role: string;
    _id: string;
  }>({
    email: "",
    name: "",
    role: "",
    _id: "",
  });

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const fetchData = await fetch(ApiSummary.all_users.url, {
        method: ApiSummary.all_users.method,
        credentials: "include",
      });
      const dataResponse = await fetchData.json();

      if (dataResponse.success) {
        setAllUsers(dataResponse.data || []);
      } else {
        toast.error(dataResponse.message || "Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Network error while fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">User Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View registered customers and manage administrative access roles
          </p>
        </div>
        <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full w-fit">
          Total Users: {allusers.length}
        </span>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 border-b border-slate-100 tracking-wider">
              <tr>
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400 text-xs">
                    Loading users list...
                  </td>
                </tr>
              ) : allusers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400 text-xs">
                    No users registered yet.
                  </td>
                </tr>
              ) : (
                allusers.map((el, i) => (
                  <tr key={el?._id || el?.id || i} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 text-xs font-medium text-slate-400">
                      {i + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 overflow-hidden border border-slate-200">
                          {el.profilePic ? (
                            <img src={el.profilePic} alt={el.name} className="w-full h-full object-cover" />
                          ) : (
                            <FiUser />
                          )}
                        </div>
                        <span className="font-semibold text-slate-800 text-sm">
                          {el.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs font-mono">
                      {el.email}
                    </td>
                    <td className="px-6 py-4">
                      {el.role === "ADMIN" ? (
                        <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-200/60">
                          <FiShield className="text-xs" /> ADMIN
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-full">
                          GENERAL
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {moment(el.createdAt).format("MMM DD, YYYY")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setUpdateUserDetails({
                            name: el.name,
                            email: el.email,
                            role: el.role,
                            _id: el._id || el.id,
                          });
                          setOpenUpdateRole(true);
                        }}
                        aria-label="Edit user role"
                        className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-600 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <FiEdit2 className="text-xs" />
                        <span>Edit Role</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openUpdateRole && (
        <ChangeUserRole
          onClose={() => setOpenUpdateRole(false)}
          name={updateUserDetails.name}
          email={updateUserDetails.email}
          role={updateUserDetails.role}
          userId={updateUserDetails._id}
          calFunc={fetchAllUsers}
        />
      )}
    </div>
  );
};

export default AllUsers;
