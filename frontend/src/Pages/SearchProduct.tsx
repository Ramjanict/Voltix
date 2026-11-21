import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ApiSummary from "../BackendUrl/backendUrl";
import SearchCard from "../Components/SearchCard";
import { FiSearch } from "react-icons/fi";
import { Product } from "../types";

const SearchProduct: React.FC = () => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q") || "";

  const fetchProductBySearch = async () => {
    try {
      setLoading(true);
      const res = await fetch(ApiSummary.searchProduct.url + location.search);
      const responseData = await res.json();
      if (responseData.success && Array.isArray(responseData.data)) {
        setData(responseData.data);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("Error fetching search results:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductBySearch();
  }, [location.search]);

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Search Results Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
              <FiSearch />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {searchQuery ? (
                  <>
                    Search Results for <span className="text-indigo-600 font-extrabold">"{searchQuery}"</span>
                  </>
                ) : (
                  "Search All Products"
                )}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {loading
                  ? "Scanning product catalog..."
                  : `Found ${data.length} matching product${data.length === 1 ? "" : "s"}`}
              </p>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <SearchCard data={data} loading={loading} />
      </div>
    </div>
  );
};

export default SearchProduct;
