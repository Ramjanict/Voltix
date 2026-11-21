import React, { useContext, useEffect, useState } from "react";
import ApiSummary from "../BackendUrl/backendUrl";
import ContextApi from "../Context/Contex";
import { MdDeleteOutline, MdLockOutline } from "react-icons/md";
import { FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { CartItem } from "../types";

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
  const subtotal = data.reduce(
    (acc, item) => acc + (item?.quantity || 1) * (item?.product?.sellingPrice || 0),
    0
  );
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
                const product = item.product;
                const itemId = item._id || item.id;
                return (
                  <div
                    key={itemId || idx}
                    className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-indigo-200 hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-4 group"
                  >
                    {/* Product Image */}
                    <Link
                      to={`/product/${product?.id || product?._id}`}
                      className="w-24 h-24 bg-slate-50 rounded-2xl p-2 flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                    >
                      <img
                        src={product?.productImage?.[0] || "https://placehold.co/100x100"}
                        alt={product?.productName}
                        className="w-full h-full object-scale-down group-hover:scale-105 transition-transform"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-0.5">
                        {product?.brandName || product?.category}
                      </span>
                      <Link
                        to={`/product/${product?.id || product?._id}`}
                        className="font-semibold text-sm sm:text-base text-slate-800 hover:text-indigo-600 transition-colors line-clamp-1 block"
                      >
                        {product?.productName}
                      </Link>
                      <p className="text-xs text-slate-400 capitalize mt-0.5">
                        Category: {product?.category}
                      </p>
                      <div className="sm:hidden font-bold text-slate-900 mt-2">
                        ${product?.sellingPrice}
                      </div>
                    </div>

                    {/* Quantity Adjuster */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5">
                        <button
                          onClick={() => updateQuantity(itemId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 disabled:opacity-40 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <FiMinus className="text-xs" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(itemId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <FiPlus className="text-xs" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="hidden sm:block text-right min-w-[80px]">
                        <span className="text-base font-bold text-slate-900">
                          ${((product?.sellingPrice || 0) * item.quantity).toFixed(2)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-slate-400 block">
                            ${product?.sellingPrice} each
                          </span>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => deleteCartProduct(itemId)}
                        className="w-9 h-9 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
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
              <span className="font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
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
