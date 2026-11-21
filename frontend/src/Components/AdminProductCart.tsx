import React, { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import AdminEditProduct from "./AdminEditProduct";
import ApiSummary from "../BackendUrl/backendUrl";
import { toast } from "react-toastify";
import { Product } from "../types";

interface AdminProductCartProps {
  data: Product | any;
  fetchAllProduct: () => void;
}

const AdminProductCart: React.FC<AdminProductCartProps> = ({ data, fetchAllProduct }) => {
  const [editProduct, setEditProduct] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAdminProductDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    try {
      setIsDeleting(true);
      const fetchData = await fetch(ApiSummary.delteAdminProduct.url, {
        method: ApiSummary.delteAdminProduct.method,
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          _id: id,
        }),
      });
      const responseData = await fetchData.json();
      if (responseData.success) {
        toast.success(responseData.message || "Product deleted successfully");
        fetchAllProduct();
      } else {
        toast.error(responseData.message || "Failed to delete product");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Network error while deleting product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      {/* Top Image & Actions */}
      <div className="relative bg-slate-50 p-4 h-44 flex items-center justify-center">
        <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-slate-600 px-2 py-0.5 rounded-md uppercase">
          {data?.category}
        </span>

        {/* Delete Action Button */}
        <button
          onClick={() => handleAdminProductDelete(data?._id || data?.id)}
          disabled={isDeleting}
          aria-label="Delete product"
          className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/90 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg flex items-center justify-center shadow-xs transition-colors"
        >
          <FiTrash2 className="text-xs" />
        </button>

        <img
          className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
          src={data?.productImage?.[0]}
          alt={data?.productName}
        />
      </div>

      {/* Info & Bottom Bar */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 mb-0.5 truncate">
            {data?.brandName}
          </p>
          <h3 className="font-semibold text-slate-800 text-xs line-clamp-1">
            {data?.productName}
          </h3>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-slate-900">${data?.sellingPrice}</span>
            {data?.price > data?.sellingPrice && (
              <span className="text-[10px] text-slate-400 line-through ml-1.5">
                ${data?.price}
              </span>
            )}
          </div>

          <button
            onClick={() => setEditProduct(true)}
            aria-label="Edit product"
            className="w-7 h-7 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-lg flex items-center justify-center transition-colors"
          >
            <FiEdit2 className="text-xs" />
          </button>
        </div>
      </div>

      {editProduct && (
        <AdminEditProduct
          productData={data}
          fetchAllProduct={fetchAllProduct}
          onClose={() => setEditProduct(false)}
        />
      )}
    </div>
  );
};

export default AdminProductCart;
