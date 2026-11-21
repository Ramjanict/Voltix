import React, { useEffect, useState } from "react";
import CategoryList from "../Components/CategoryList";
import BannerProduct from "../Components/BannerProduct";
import HorizontalCardProduct from "../Components/HorizontalCardProduct";
import VerticalCardProduct from "../Components/VerticalCardProduct";
import SearchCard from "../Components/SearchCard";
import ApiSummary from "../BackendUrl/backendUrl";
import { Link } from "react-router-dom";
import { FiArrowRight, FiGrid } from "react-icons/fi";
import { Product } from "../types";

const Home: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadingAll, setLoadingAll] = useState<boolean>(true);

  const fetchAllProducts = async () => {
    try {
      setLoadingAll(true);
      const res = await fetch(ApiSummary.AllProduct.url);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setAllProducts(data.data);
      }
    } catch (err) {
      console.warn("Failed to fetch all products for home catalog:", err);
    } finally {
      setLoadingAll(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div className="space-y-6">
      <CategoryList />
      <BannerProduct />

      {/* Curated Category Carousels */}
      <HorizontalCardProduct
        category="airpodes"
        heading="Trending Audio & Airpods"
      />

      <HorizontalCardProduct
        category="watches"
        heading="Popular Smart Watches"
      />

      <VerticalCardProduct
        category="mobiles"
        heading="Flagship Smartphones"
      />

      <VerticalCardProduct
        category="earphones"
        heading="Headphones & Hi-Fi Sound"
      />

      <VerticalCardProduct
        category="camera"
        heading="Professional Cameras & Lenses"
      />

      <VerticalCardProduct
        category="Mouse"
        heading="Precision Mice & Accessories"
      />

      <VerticalCardProduct
        category="televisions"
        heading="4K & Smart Home Entertainment"
      />

      {/* Complete Catalog Section: Show All Products */}
      <section className="container mx-auto px-4 my-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-200/80 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
              <FiGrid />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Explore All Products
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Browse our complete collection of {allProducts.length} premium electronics & gadgets
              </p>
            </div>
          </div>
          <Link
            to="/product-category"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline self-start sm:self-auto"
          >
            <span>View All with Filters</span>
            <FiArrowRight className="text-xs" />
          </Link>
        </div>

        <SearchCard data={allProducts} loading={loadingAll} />
      </section>
    </div>
  );
};

export default Home;
