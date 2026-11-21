import React, { useContext, useEffect, useRef, useState } from "react";
import FetchCategoryWiseProduct from "../../helper/FetchCategoryWiseProduct";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";
import AddToCard from "../../helper/AddToCard";
import ContextApi from "../Context/Contex";
import { Product } from "../types";

interface HorizontalCardProductProps {
  category: string;
  heading: string;
}

const HorizontalCardProduct: React.FC<HorizontalCardProductProps> = ({
  category,
  heading,
}) => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(6).fill(null);
  const scrollElement = useRef<HTMLDivElement>(null);
  const { fetchAddToCart } = useContext(ContextApi);

  const scrollRight = () => {
    if (scrollElement.current) {
      scrollElement.current.scrollLeft += 340;
    }
  };
  const scrollLeft = () => {
    if (scrollElement.current) {
      scrollElement.current.scrollLeft -= 340;
    }
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
      console.warn("Horizontal fetch error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  const handleAddToCart = async (e: React.SyntheticEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    await AddToCard(e, id);
    fetchAddToCart();
  };

  if (!loading && data.length === 0) {
    return null; // Don't show empty sections
  }

  return (
    <section className="container mx-auto px-4 my-8 relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {heading}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Top picks curated for you in {category}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={scrollLeft}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-400 hover:shadow-md flex items-center justify-center transition-all"
            aria-label="Previous"
          >
            <FaAngleLeft className="text-sm" />
          </button>
          <button
            onClick={scrollRight}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-400 hover:shadow-md flex items-center justify-center transition-all"
            aria-label="Next"
          >
            <FaAngleRight className="text-sm" />
          </button>
        </div>
      </div>

      <div
        className="flex items-center gap-4 sm:gap-5 overflow-x-auto scroll-smooth scrollbar-none py-2"
        ref={scrollElement}
      >
        {loading
          ? loadingList.map((_, index) => (
              <div
                key={index}
                className="w-72 sm:w-80 h-36 bg-white rounded-2xl border border-slate-200/80 p-3 flex gap-3 flex-shrink-0 animate-pulse"
              >
                <div className="w-28 h-full bg-slate-200/80 rounded-xl flex-shrink-0" />
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="h-4 bg-slate-200 rounded-full w-3/4" />
                  <div className="h-3 bg-slate-200 rounded-full w-1/2" />
                  <div className="h-4 bg-slate-200 rounded-full w-1/3" />
                  <div className="h-7 bg-slate-200 rounded-full w-full" />
                </div>
              </div>
            ))
          : data.map((product, index) => {
              const productId = product._id || product.id;
              const discount =
                product.price && product.sellingPrice
                  ? Math.round(((product.price - product.sellingPrice) / product.price) * 100)
                  : 0;

              return (
                <Link
                  to={`/product/${productId}`}
                  key={productId || index}
                  className="group w-72 sm:w-80 h-36 bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-500/30 hover:shadow-md hover:-translate-y-0.5 p-3 flex gap-3 flex-shrink-0 transition-all duration-200 relative overflow-hidden"
                >
                  <div className="w-28 h-full bg-slate-50 rounded-xl p-2 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                    <img
                      className="w-full h-full object-scale-down group-hover:scale-105 transition-transform duration-300"
                      src={product.productImage?.[0] || "https://placehold.co/120x120"}
                      alt={product.productName}
                    />
                    {discount > 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 block">
                        {product.brandName || product.category}
                      </span>
                      <h3 className="font-semibold text-sm text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {product.productName}
                      </h3>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold text-slate-900">
                        ${product.sellingPrice}
                      </span>
                      {product.price > product.sellingPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          ${product.price}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(e, productId)}
                      className="w-full py-1.5 px-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-indigo-500/20 transition-all text-center"
                    >
                      Add to Cart
                    </button>
                  </div>
                </Link>
              );
            })}
      </div>
    </section>
  );
};

export default HorizontalCardProduct;
