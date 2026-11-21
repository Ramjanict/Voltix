import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import productCategory from "../../helper/ProductCategory";
import SearchCard from "../Components/SearchCard";
import ApiSummary from "../BackendUrl/backendUrl";
import { FiFilter, FiCheck } from "react-icons/fi";
import { Product } from "../types";

const ProductCategory: React.FC = () => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const urlSearch = new URLSearchParams(location.search);
  const urlCategoryListArray = urlSearch.getAll("category");
  const urlCategoryListObject: Record<string, boolean> = {};
  urlCategoryListArray.forEach((el) => {
    urlCategoryListObject[el] = true;
  });

  const [selectCategory, setSelectCategory] = useState<Record<string, boolean>>(urlCategoryListObject);
  const [filterCategoryList, setFilterCategoryList] = useState<string[]>([]);

  const handleSortBy = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSortBy(value);
    if (value === "asc") {
      setData((prev) => [...prev].sort((a, b) => a.sellingPrice - b.sellingPrice));
    }
    if (value === "dsc") {
      setData((prev) => [...prev].sort((a, b) => b.sellingPrice - a.sellingPrice));
    }
  };

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      const fetchData = await fetch(ApiSummary.filter_product.url, {
        method: ApiSummary.filter_product.method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ category: filterCategoryList }),
      });
      const responseData = await fetchData.json();
      let products: Product[] = responseData.data || [];
      if (sortBy === "asc") {
        products = [...products].sort((a, b) => a.sellingPrice - b.sellingPrice);
      } else if (sortBy === "dsc") {
        products = [...products].sort((a, b) => b.sellingPrice - a.sellingPrice);
      }
      setData(products);
    } catch (err) {
      console.warn("Category filter fetch error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, [filterCategoryList]);

  useEffect(() => {
    const arrayCategory = Object.keys(selectCategory)
      .map((catKey) => (selectCategory[catKey] ? catKey : null))
      .filter((cat): cat is string => Boolean(cat));

    setFilterCategoryList(arrayCategory);

    const queryParams = arrayCategory.map((cat) => `category=${encodeURIComponent(cat)}`).join("&");
    navigate(`/product-category${queryParams ? "?" + queryParams : ""}`, { replace: true });
  }, [selectCategory]);

  const handleSelectCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSelectCategory((prev) => ({
      ...prev,
      [value]: checked,
    }));
  };

  const clearAllFilters = () => {
    setSelectCategory({});
    setSortBy("");
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex-shrink-0 self-start">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div className="flex items-center gap-2">
              <FiFilter className="text-indigo-600" />
              <h2 className="font-bold text-slate-900 text-base">Filters</h2>
            </div>
            {filterCategoryList.length > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Sort By */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Sort By Price
            </h3>
            <div className="space-y-2 text-sm text-slate-700">
              <label className="flex items-center gap-2.5 cursor-pointer hover:text-indigo-600 transition-colors">
                <input
                  type="radio"
                  name="sort"
                  value="asc"
                  checked={sortBy === "asc"}
                  onChange={handleSortBy}
                  className="accent-indigo-600 w-4 h-4 cursor-pointer"
                />
                <span>Price: Low to High</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer hover:text-indigo-600 transition-colors">
                <input
                  type="radio"
                  name="sort"
                  value="dsc"
                  checked={sortBy === "dsc"}
                  onChange={handleSortBy}
                  className="accent-indigo-600 w-4 h-4 cursor-pointer"
                />
                <span>Price: High to Low</span>
              </label>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Categories
            </h3>
            <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin text-sm text-slate-700">
              {productCategory.map((cat, idx) => (
                <label
                  key={idx}
                  className="flex items-center justify-between cursor-pointer hover:text-indigo-600 group transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      name="category"
                      value={cat.value}
                      checked={Boolean(selectCategory[cat.value])}
                      onChange={handleSelectCategory}
                      className="rounded accent-indigo-600 w-4 h-4 cursor-pointer"
                    />
                    <span className="capitalize">{cat.label}</span>
                  </div>
                  {selectCategory[cat.value] && (
                    <FiCheck className="text-xs text-indigo-600" />
                  )}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Catalog Grid */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {filterCategoryList.length === 1
                  ? `${filterCategoryList[0].toUpperCase()} Collection`
                  : "Explore All Products"}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {data.length} {data.length === 1 ? "result" : "results"}
              </p>
            </div>
          </div>

          <SearchCard loading={loading} data={data} />
        </main>
      </div>
    </div>
  );
};

export default ProductCategory;
