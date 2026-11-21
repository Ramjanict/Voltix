import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ApiSummary from "../BackendUrl/backendUrl";
import { FaStar, FaShieldAlt } from "react-icons/fa";
import { FiTruck, FiRotateCcw, FiShoppingCart, FiZap } from "react-icons/fi";
import CategoryWiseProductDisplay from "../Components/CategoryWiseProductDisplay";
import AddToCard from "../../helper/AddToCard";
import ContextApi from "../Context/Contex";
import { Product } from "../types";

const ProductDetails: React.FC = () => {
  const { fetchAddToCart } = useContext(ContextApi);
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<Product>({
    id: "",
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: 0,
    sellingPrice: 0,
  });

  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [zoomImage, setZoomImage] = useState(false);
  const [zoomCoordinates, setZoomCoordinates] = useState({ x: 0, y: 0 });
  const [quantity, setQuantity] = useState(1);

  const handleZoom = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomCoordinates({ x, y });
    setZoomImage(true);
  }, []);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(ApiSummary.productDetails.url, {
        method: ApiSummary.productDetails.method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId: params?.id }),
      });
      const dataResponse = await response.json();
      if (dataResponse?.data) {
        setData(dataResponse.data);
        setActiveImage(dataResponse.data.productImage?.[0] || "");
      }
    } catch (err) {
      console.warn("Failed to fetch product details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [params?.id]);

  const handleAddToCart = async (e: React.SyntheticEvent, id: string) => {
    await AddToCard(e, id);
    fetchAddToCart();
  };

  const handleBuyNow = async (e: React.SyntheticEvent, id: string) => {
    await AddToCard(e, id);
    fetchAddToCart();
    navigate("/cart");
  };

  const discount =
    data.price && data.sellingPrice && data.price > data.sellingPrice
      ? Math.round(((data.price - data.sellingPrice) / data.price) * 100)
      : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 capitalize">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <span>/</span>
        <Link to={`/product-category?category=${data.category}`} className="hover:text-indigo-600">
          {data.category || "Catalog"}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium truncate max-w-xs">{data.productName}</span>
      </nav>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[480px] scrollbar-none scroll-smooth">
              {data.productImage?.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  onMouseEnter={() => setActiveImage(img)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border p-2 flex-shrink-0 bg-slate-50 transition-all cursor-pointer ${
                    activeImage === img
                      ? "border-indigo-600 ring-2 ring-indigo-600/20 shadow-xs"
                      : "border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-scale-down"
                  />
                </button>
              ))}
            </div>

            {/* Main Stage Image */}
            <div
              className="relative flex-1 h-80 sm:h-[480px] bg-slate-50 rounded-2xl border border-slate-100 p-6 flex items-center justify-center overflow-hidden cursor-crosshair group"
              onMouseMove={handleZoom}
              onMouseLeave={() => setZoomImage(false)}
            >
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs z-10">
                  {discount}% OFF
                </span>
              )}

              {loading ? (
                <div className="w-full h-full bg-slate-200 animate-pulse rounded-xl" />
              ) : (
                <img
                  src={activeImage || "https://placehold.co/400x400"}
                  alt={data.productName}
                  className="w-full h-full object-scale-down transition-transform duration-300 group-hover:scale-105"
                />
              )}

              {/* Zoom Overlay (Desktop only) */}
              {zoomImage && (
                <div
                  className="hidden lg:block absolute inset-0 pointer-events-none z-20 bg-no-repeat bg-white"
                  style={{
                    backgroundImage: `url(${activeImage})`,
                    backgroundPosition: `${zoomCoordinates.x}% ${zoomCoordinates.y}%`,
                    backgroundSize: "220%",
                  }}
                />
              )}
            </div>
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  {data.brandName || data.category}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 leading-snug">
                  {data.productName}
                </h1>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-400 text-sm">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
                <span className="text-xs font-semibold text-slate-700">4.9</span>
                <span className="text-xs text-slate-400">• 128 verified customer reviews</span>
              </div>

              {/* Price Details */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-slate-900">
                    ${data.sellingPrice}
                  </span>
                  {data.price > data.sellingPrice && (
                    <span className="text-lg text-slate-400 line-through">
                      ${data.price}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      Save ${(data.price - data.sellingPrice).toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">Inclusive of all local taxes & warranty</p>
              </div>

              {/* Description */}
              <div className="pt-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Product Overview
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {data.description || "Premium electronics crafted for peak performance, modern aesthetics, and daily durability."}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="pt-2 flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Quantity:
                </span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="px-3 py-1 text-slate-600 hover:text-slate-900 text-sm font-semibold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-slate-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="px-3 py-1 text-slate-600 hover:text-slate-900 text-sm font-semibold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-6 space-y-3 mt-6 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={(e) => handleAddToCart(e, data.id || data._id!)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold rounded-2xl transition-all shadow-xs active:scale-98 cursor-pointer"
                >
                  <FiShoppingCart />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={(e) => handleBuyNow(e, data.id || data._id!)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl transition-all shadow-md shadow-indigo-600/25 active:scale-98 cursor-pointer"
                >
                  <FiZap />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Trust Features */}
              <div className="grid grid-cols-3 gap-2 pt-4 text-center border-t border-slate-100 text-[11px] text-slate-500">
                <div className="flex flex-col items-center gap-1">
                  <FiTruck className="text-indigo-600 text-base" />
                  <span>Express Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <FaShieldAlt className="text-indigo-600 text-base" />
                  <span>1 Year Warranty</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <FiRotateCcw className="text-indigo-600 text-base" />
                  <span>30 Days Return</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Products Carousel */}
      {data.category && (
        <div className="mt-12">
          <CategoryWiseProductDisplay
            category={data.category}
            heading="Customers Also Viewed"
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
