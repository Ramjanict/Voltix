import React, { useEffect, useState } from "react";
import ApiSummary from "../BackendUrl/backendUrl";
import { Link } from "react-router-dom";
import productCategoryList from "../../helper/ProductCategory";

interface CategoryProductItem {
  category: string;
  productImage?: string[];
}

const CategoryList: React.FC = () => {
  const [categoryProduct, setCategoryProduct] = useState<CategoryProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const skeletonList = new Array(8).fill(null);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const res = await fetch(ApiSummary.categoryProduct.url);
      if (!res.ok) throw new Error("Network response was not ok");
      const resData = await res.json();
      if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
        // Map fetched products by category
        const categoryMap = new Map<string, string>();
        resData.data.forEach((p: any) => {
          if (p.category && p.productImage?.[0]) {
            categoryMap.set(p.category.toLowerCase(), p.productImage[0]);
          }
        });

        // Present all 12 categories with fetched product image if available
        const allCategories: CategoryProductItem[] = productCategoryList.map((cat) => ({
          category: cat.value,
          productImage: categoryMap.has(cat.value.toLowerCase())
            ? [categoryMap.get(cat.value.toLowerCase())!]
            : [],
        }));

        setCategoryProduct(allCategories);
      } else {
        setCategoryProduct(
          productCategoryList.map((cat) => ({
            category: cat.value,
            productImage: [],
          }))
        );
      }
    } catch (err: any) {
      console.warn("Category fetch fallback:", err.message);
      setCategoryProduct(
        productCategoryList.map((cat) => ({
          category: cat.value,
          productImage: [],
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6">
      <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto scroll-smooth scrollbar-none pb-2 justify-start md:justify-center">
        {loading
          ? skeletonList.map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 flex-shrink-0"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-200/80 rounded-2xl animate-pulse" />
                <div className="w-12 h-3 bg-slate-200 rounded-full animate-pulse" />
              </div>
            ))
          : categoryProduct.map((product, index) => {
              const categoryName = product.category;
              return (
                <Link
                  to={`/product-category?category=${encodeURIComponent(categoryName)}`}
                  key={index}
                  className="group flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-slate-200/70 shadow-xs flex items-center justify-center p-2.5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:border-indigo-400 group-hover:bg-indigo-50/20">
                    {product?.productImage?.[0] ? (
                      <img
                        className="w-full h-full object-scale-down transition-transform duration-300 group-hover:rotate-3"
                        src={product.productImage[0]}
                        alt={categoryName}
                      />
                    ) : (
                      <span className="text-xl sm:text-2xl font-bold text-indigo-600 uppercase">
                        {categoryName.slice(0, 2)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-700 capitalize group-hover:text-indigo-600 transition-colors">
                    {categoryName}
                  </p>
                </Link>
              );
            })}
      </div>
    </div>
  );
};

export default CategoryList;
