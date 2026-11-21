import React, { useContext, useEffect, useState } from "react";
import FetchCategoryWiseProduct from "../../helper/FetchCategoryWiseProduct";
import { Link } from "react-router-dom";
import AddToCard from "../../helper/AddToCard";
import ScrollTop from "../../helper/ScrollTop";
import ContextApi from "../Context/Contex";
import { FaShoppingCart, FaStar } from "react-icons/fa";
import { Product } from "../types";

interface CategoryWiseProductDisplayProps {
  category: string;
  heading: string;
}

const loadingList = new Array(4).fill(null);

const CategoryWiseProductDisplay: React.FC<CategoryWiseProductDisplayProps> = ({
  category,
  heading,
}) => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { fetchAddToCart } = useContext(ContextApi);

  const handleAddToCart = async (e: React.SyntheticEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    await AddToCard(e, id);
    fetchAddToCart();
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const categoryProduct = await FetchCategoryWiseProduct(category);
      if (categoryProduct?.data && Array.isArray(categoryProduct.data)) {
        setData(categoryProduct.data);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("Error fetching category products:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category) {
      fetchData();
    }
  }, [category]);

  if (!loading && data.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 my-10 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            {heading}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Handpicked recommendations for you</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {loading
          ? loadingList.map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm animate-pulse flex flex-col justify-between"
              >
                <div className="bg-slate-200 h-48 rounded-xl w-full mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-5 bg-slate-200 rounded w-4/5"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-9 bg-slate-200 rounded-xl w-24"></div>
                  </div>
                </div>
              </div>
            ))
          : data.map((product, index) => {
              const productId = product._id || product.id;
              const discount =
                product?.price && product?.sellingPrice && product.price > product.sellingPrice
                  ? Math.round(((product.price - product.sellingPrice) / product.price) * 100)
                  : 0;

              return (
                <Link
                  to={"/product/" + productId}
                  onClick={ScrollTop}
                  key={productId || index}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Image Container */}
                  <div className="relative bg-gradient-to-b from-slate-50 to-slate-100/60 h-52 p-4 flex items-center justify-center overflow-hidden">
                    {discount > 0 && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-rose-500 to-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm z-10">
                        {discount}% OFF
                      </span>
                    )}
                    <span className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-slate-600 text-[11px] font-medium px-2 py-0.5 rounded-full capitalize border border-slate-200/50">
                      {product?.category}
                    </span>
                    <img
                      className="object-contain h-full w-full group-hover:scale-108 transition-all duration-500 mix-blend-multiply"
                      src={product?.productImage?.[0]}
                      alt={product?.productName}
                      loading="lazy"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <p className="text-xs uppercase font-semibold text-indigo-600 tracking-wider mb-1">
                        {product?.brandName}
                      </p>
                      <h3 className="font-semibold text-slate-800 text-sm md:text-base line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {product?.productName}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mt-1.5 text-amber-400 text-xs">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar className="text-slate-200" />
                        <span className="text-slate-400 text-[11px] ml-1">(4.8)</span>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base md:text-lg font-bold text-slate-900">
                            ${product?.sellingPrice}
                          </span>
                          {product?.price > product?.sellingPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              ${product?.price}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(e, productId)}
                        aria-label="Add to cart"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-200 active:scale-95"
                      >
                        <FaShoppingCart className="text-xs" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
      </div>
    </div>
  );
};

export default CategoryWiseProductDisplay;
