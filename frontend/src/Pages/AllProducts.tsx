import React, { useEffect, useState } from "react";
import UploadProducts from "../Components/UploadProducts";
import ApiSummary from "../BackendUrl/backendUrl";
import AdminProductCart from "../Components/AdminProductCart";
import { FiPlus, FiPackage } from "react-icons/fi";
import { Product } from "../types";

const AllProducts: React.FC = () => {
  const [openUploadProduct, setUploadProduct] = useState(false);
  const [allproducts, setAllproducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(ApiSummary.AllProduct.url);
      const dataResponse = await response.json();
      setAllproducts(dataResponse.data || []);
    } catch (err) {
      console.error("Error fetching admin products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Products Catalog</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your store inventory, edit listings, and track pricing
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            Total: {allproducts.length}
          </span>
          <button
            onClick={() => setUploadProduct(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all active:scale-95 cursor-pointer"
          >
            <FiPlus className="text-sm" />
            <span>Upload Product</span>
          </button>
        </div>
      </div>

      {/* Product Grid / Loading / Empty */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-pulse">
          {new Array(5).fill(null).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 h-64"></div>
          ))}
        </div>
      ) : allproducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
            <FiPackage />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No products yet</h3>
          <p className="text-sm text-slate-500 mb-6">
            Upload your first product to start populating your catalog.
          </p>
          <button
            onClick={() => setUploadProduct(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer"
          >
            <FiPlus />
            Upload Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {allproducts.map((product, index) => (
            <AdminProductCart
              data={product}
              key={product?._id || product?.id || index}
              fetchAllProduct={fetchAllProduct}
            />
          ))}
        </div>
      )}

      {/* Upload Product Modal */}
      {openUploadProduct && (
        <UploadProducts
          fetchAllProduct={fetchAllProduct}
          onClose={() => setUploadProduct(false)}
        />
      )}
    </div>
  );
};

export default AllProducts;
