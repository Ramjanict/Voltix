import React, { useContext, useEffect, useRef, useState } from "react";
import FetchCategoryWiseProduct from "../../helper/FetchCategoryWiseProduct";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";
import AddToCard from "../../helper/AddToCard";
import ContextApi from "../Context/Contex";
import { Product } from "../types";

interface VerticalCardProductProps {
  category: string;
  heading: string;
}

const VerticalCardProduct: React.FC<VerticalCardProductProps> = ({
  category,
  heading,
}) => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(5).fill(null);
  const scrollElement = useRef<HTMLDivElement>(null);
  const { fetchAddToCart } = useContext(ContextApi);

  const scrollRight = () => {
    if (scrollElement.current) {
      scrollElement.current.scrollLeft += 300;
    }
  };
  const scrollLeft = () => {
    if (scrollElement.current) {
      scrollElement.current.scrollLeft -= 300;
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
      console.warn("Vertical fetch error:", err);
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
    <section className="container mx-auto px-4 my-10 relative">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {heading}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Explore high-performance {category} products
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
        className="flex items-center gap-4 sm:gap-6 overflow-x-auto scroll-smooth scrollbar-none py-2"
        ref={scrollElement}
      >
        {loading
          ? loadingList.map((_, index) => (
              <div
                key={index}
                className="w-64 sm:w-72 bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col gap-3 flex-shrink-0 animate-pulse"
              >
                <div className="w-full h-48 bg-slate-200/80 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded-full w-3/4" />
                <div className="h-3 bg-slate-200 rounded-full w-1/2" />
                <div className="h-5 bg-slate-200 rounded-full w-1/3" />
                <div className="h-9 bg-slate-200 rounded-full w-full mt-2" />
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
                  className="group w-64 sm:w-72 bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-500/30 hover:shadow-lg hover:-translate-y-1 p-4 flex flex-col justify-between flex-shrink-0 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="w-full h-48 bg-slate-50 rounded-xl p-3 flex items-center justify-center relative overflow-hidden">
                    <img
                      className="w-full h-full object-scale-down group-hover:scale-108 transition-transform duration-300"
                      src={product.productImage?.[0] || "https://placehold.co/200x200"}
                      alt={product.productName}
                    />
                    {discount > 0 && (
                      <span className="absolute top-2 left-2 bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between pt-3 gap-2">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 block">
                        {product.brandName || product.category}
                      </span>
                      <h3 className="font-semibold text-sm sm:text-base text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {product.productName}
                      </h3>
                    </div>

                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-lg font-bold text-slate-900">
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
                      className="w-full py-2 px-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-indigo-500/20 transition-all text-center mt-1"
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

export default VerticalCardProduct;
