import React, { useContext, useEffect, useState } from "react";
import ApiSummary from "../BackendUrl/backendUrl";
import ContextApi from "../Context/Contex";
import { MdDeleteOutline, MdLockOutline } from "react-icons/md";
import { FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { CartItem, Product } from "../types";

const DEFAULT_FALLBACK_IMG =
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500";

// Safely extract product whether nested under product or productId
const getProduct = (item: any): Product | null => {
  if (
    item?.product &&
    typeof item.product === "object" &&
    (item.product.productName || item.product.id)
  ) {
    return item.product;
  }
  if (
    item?.productId &&
    typeof item.productId === "object" &&
    (item.productId.productName || item.productId.id)
  ) {
    return item.productId;
  }
  return item?.product || item?.productId || null;
};

// Safely extract real product image
const getProductImage = (product: any): string => {
  if (!product) return DEFAULT_FALLBACK_IMG;
  const img = product.productImage || product.image;
  if (Array.isArray(img) && img.length > 0 && typeof img[0] === "string" && img[0].trim()) {
    return img[0];
  }
  if (typeof img === "string" && img.trim()) {
    if (img.startsWith("[") && img.endsWith("]")) {
      try {
        const parsed = JSON.parse(img);
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
          return parsed[0];
        }
      } catch (e) {}
    }
    return img;
  }
  return DEFAULT_FALLBACK_IMG;
};

// Safely extract real selling price
const getRealPrice = (product: any): number => {
  if (!product) return 0;
  const selling = Number(product.sellingPrice);
  if (!isNaN(selling) && selling > 0) return selling;
  const regular = Number(product.price);
  if (!isNaN(regular) && regular > 0) return regular;
  return 0;
};

// Safely extract original MSRP / regular price
const getOriginalPrice = (product: any): number => {
  if (!product) return 0;
  const regular = Number(product.price);
  if (!isNaN(regular) && regular > 0) return regular;
  return getRealPrice(product);
};

const Cart: React.FC = () => {
  const [data, setData] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { cartProductCount, fetchAddToCart } = useContext(ContextApi);

  const fetchUserCart = async () => {
    try {
      setLoading(true);
      const fetchData = await fetch(ApiSummary.addToCartProductView.url, {
        method: ApiSummary.addToCartProductView.method,
        credentials: "include",
        headers: { "content-type": "application/json" },
      });
      if (!fetchData.ok) return;
      const responseData = await fetchData.json();
      if (responseData.success && Array.isArray(responseData.data)) {
        setData(responseData.data);
      }
    } catch (err) {
      console.warn("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCart();
  }, []);

  const updateQuantity = async (id: string, newQty: number) => {
    if (newQty < 1) return;
    try {
      const fetchData = await fetch(ApiSummary.updateCartProduct.url, {
        method: ApiSummary.updateCartProduct.method,
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ _id: id, quantity: newQty }),
      });
      const responseData = await fetchData.json();
      if (responseData.success) {
        fetchUserCart();
      }
    } catch (err) {
      toast.error("Failed to update item quantity");
    }
  };

  const deleteCartProduct = async (id: string) => {
    try {
      const fetchData = await fetch(ApiSummary.deleteCartProduct.url, {
        method: ApiSummary.deleteCartProduct.method,
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      const responseData = await fetchData.json();
      if (responseData.success) {
        toast.success("Item removed from cart");
        fetchUserCart();
        fetchAddToCart();
      }
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const totalQuantity = data.reduce((acc, item) => acc + (item?.quantity || 1), 0);
  const subtotal = data.reduce((acc, item) => {
    const prod = getProduct(item);
    return acc + (item?.quantity || 1) * getRealPrice(prod);
  }, 0);

  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 15;
  const grandTotal = subtotal + shipping;

  const handleStripeCheckout = async () => {
    if (data.length === 0) {
      toast.info("Your cart is empty!");
      return;
    }

    try {
      setCheckoutLoading(true);
      const stripePublicKey =
        import.meta.env.VITE_STRIPE_PUBLIC_KEY ||
        "pk_test_HQNnZInlzJ1JhfF2CaLXSPXv";

      const stripePromise = await loadStripe(stripePublicKey);

      const response = await fetch(ApiSummary.payment.url, {
        method: ApiSummary.payment.method,
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ cartItems: data }),
      });

      const session = await response.json();

      if (session?.id && stripePromise) {
        await stripePromise.redirectToCheckout({ sessionId: session.id });
      } else {
        toast.error(session?.message || "Failed to initialize Stripe checkout.");
      }
    } catch (err) {
      console.error("Stripe Checkout Error:", err);
      toast.error("Error redirecting to Stripe payment gateway.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (!loading && data.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-lg">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-sm">
          <FiShoppingBag />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          Looks like you haven't added any products to your cart yet. Explore our latest electronics and find something you love.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-md shadow-indigo-600/25 transition-all text-sm"
        >
          <span>Start Shopping</span>
          <FiArrowRight />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {totalQuantity} {totalQuantity === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <Link
          to="/product-category"
          className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-8 space-y-4">
          {loading
            ? new Array(3).fill(null).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex gap-4 animate-pulse h-32"
                />
              ))
            : data.map((item, idx) => {
                const product = getProduct(item);
                const realPrice = getRealPrice(product);
                const originalPrice = getOriginalPrice(product);
                const hasDiscount = originalPrice > realPrice && realPrice > 0;
                const discountPercent = hasDiscount
                  ? Math.round(((originalPrice - realPrice) / originalPrice) * 100)
                  : 0;
                const productImage = getProductImage(product);
                const productId = product?._id || product?.id;
                const itemId = item._id || item.id;

                return (
                  <div
                    key={itemId || idx}
                    className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-indigo-200 hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-4 group"
                  >
                    {/* Product Image */}
                    <Link
                      to={productId ? `/product/${productId}` : "#"}
                      className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-50 rounded-2xl p-2 flex items-center justify-center flex-shrink-0 relative overflow-hidden border border-slate-100 group-hover:border-indigo-100 transition-colors"
                    >
                      <img
                        src={productImage}
                        alt={product?.productName || "Product"}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            DEFAULT_FALLBACK_IMG;
                        }}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {hasDiscount && (
                        <span className="absolute top-1.5 left-1.5 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                          -{discountPercent}%
                        </span>
                      )}
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {product?.brandName || "Electronics"}
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize">
                          • {product?.category || "Gadget"}
                        </span>
                      </div>

                      <Link
                        to={productId ? `/product/${productId}` : "#"}
                        className="font-semibold text-sm sm:text-base text-slate-800 hover:text-indigo-600 transition-colors line-clamp-1 block"
                      >
                        {product?.productName || "Product Item"}
                      </Link>

                      {/* Real Price Display */}
                      <div className="flex items-baseline gap-2 mt-2 justify-center sm:justify-start">
                        <span className="text-base sm:text-lg font-bold text-slate-900">
                          ${realPrice.toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-slate-400 line-through">
                            ${originalPrice.toFixed(2)}
                          </span>
                        )}
                        {hasDiscount && (
                          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Save ${(originalPrice - realPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Adjuster */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5">
                        <button
                          onClick={() => updateQuantity(itemId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 disabled:opacity-40 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <FiMinus className="text-xs" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(itemId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <FiPlus className="text-xs" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="hidden sm:block text-right min-w-[90px]">
                        <span className="text-base font-bold text-slate-900 block">
                          ${(realPrice * item.quantity).toFixed(2)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-slate-400 block">
                            ${realPrice.toFixed(2)} each
                          </span>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => deleteCartProduct(itemId)}
                        className="w-9 h-9 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <MdDeleteOutline className="text-lg" />
                      </button>
                    </div>
                  </div>
                );
              })}
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal ({totalQuantity} items)</span>
              <span className="font-semibold text-slate-800">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Estimated Shipping</span>
              <span className="font-semibold text-slate-800">
                {shipping === 0 ? (
                  <span className="text-emerald-600 uppercase text-xs font-bold">Free</span>
                ) : (
                  `$${shipping.toFixed(2)}`
                )}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax (Included)</span>
              <span className="font-semibold text-slate-800">$0.00</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-base font-bold text-slate-900">Total</span>
              <span className="text-2xl font-black text-indigo-600">
                ${grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={handleStripeCheckout}
            disabled={checkoutLoading || data.length === 0}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-lg shadow-indigo-600/25 transition-all duration-200 active:scale-98 disabled:opacity-50 text-sm cursor-pointer"
          >
            <MdLockOutline className="text-base" />
            <span>{checkoutLoading ? "Redirecting to Stripe..." : "Checkout with Stripe"}</span>
          </button>

          <p className="text-[11px] text-center text-slate-400">
            Guaranteed safe checkout powered by Stripe SSL Encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
