import React, { useEffect, useState } from "react";
import ApiSummary from "../BackendUrl/backendUrl";
import moment from "moment";
import { Link } from "react-router-dom";
import { FiShoppingBag, FiArrowRight, FiCheckCircle, FiClock, FiTruck } from "react-icons/fi";
import { Order as OrderType } from "../types";

const Order: React.FC = () => {
  const [data, setData] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(ApiSummary.myOrders.url, {
        method: ApiSummary.myOrders.method,
        credentials: "include",
      });
      const resData = await res.json();
      if (resData.success) {
        setData(resData.data || []);
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl min-h-[calc(100vh-140px)]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Order History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track and manage your recent electronic purchases
          </p>
        </div>
        <Link
          to="/product-category"
          className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          Explore Catalog
        </Link>
      </div>

      {loading && (
        <div className="space-y-4">
          {new Array(3).fill(null).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs animate-pulse h-40" />
          ))}
        </div>
      )}

      {!loading && data.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto my-12 shadow-sm">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
            <FiShoppingBag />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No orders yet</h3>
          <p className="text-sm text-slate-500 mb-6">
            You haven't placed any orders yet. Discover our tech deals and place your first order.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-md shadow-indigo-600/20 text-xs transition-all"
          >
            <span>Start Shopping</span>
            <FiArrowRight />
          </Link>
        </div>
      )}

      <div className="space-y-6">
        {data.map((order, idx) => {
          const orderId = order.id || order._id || `order-${idx}`;
          const itemsTotal = (order.items || []).reduce((acc: number, item: any) => {
            const p = Number(item.price || item.sellingPrice || 0);
            const q = Number(item.quantity || 1);
            return acc + p * q;
          }, 0);

          const orderTotal =
            typeof order.totalAmount === "number" && order.totalAmount > 0
              ? order.totalAmount
              : typeof order.amount === "number" && order.amount > 0
              ? order.amount
              : itemsTotal;

          return (
            <div
              key={orderId}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-slate-50/80 p-5 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4 text-xs">
                <div>
                  <span className="font-semibold text-slate-500 block text-[10px] uppercase tracking-wider">
                    Order Reference
                  </span>
                  <span className="font-mono font-bold text-slate-800 text-sm">
                    {orderId}
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-slate-500 block text-[10px] uppercase tracking-wider">
                    Date Placed
                  </span>
                  <span className="font-medium text-slate-700">
                    {moment(order.createdAt).format("MMM DD, YYYY · h:mm a")}
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-slate-500 block text-[10px] uppercase tracking-wider">
                    Payment
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 font-bold text-[11px] px-2.5 py-0.5 rounded-full ${
                      order.paymentStatus === "PAID"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    <FiCheckCircle className="text-xs" />
                    {order.paymentStatus || "PAID"}
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-slate-500 block text-[10px] uppercase tracking-wider">
                    Fulfillment
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 font-bold text-[11px] px-2.5 py-0.5 rounded-full ${
                      order.orderStatus === "DELIVERED"
                        ? "bg-emerald-50 text-emerald-700"
                        : order.orderStatus === "SHIPPED"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-indigo-50 text-indigo-700"
                    }`}
                  >
                    <FiTruck className="text-xs" />
                    {order.orderStatus || "PROCESSING"}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="p-5 divide-y divide-slate-100">
                {(order.items || []).map((item: any, i: number) => {
                  const itemPrice = Number(item.price || item.sellingPrice || 0);
                  const itemQty = Number(item.quantity || 1);
                  const itemImg =
                    item.image ||
                    (Array.isArray(item.productImage)
                      ? item.productImage[0]
                      : item.productImage) ||
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500";

                  return (
                    <div
                      key={i}
                      className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-xl bg-slate-50 p-1.5 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                          <img
                            src={itemImg}
                            alt={item.title || item.productName || item.name || "Product"}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500";
                            }}
                            className="w-full h-full object-scale-down"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800 text-sm line-clamp-1">
                            {item.title || item.productName || item.name || "Product"}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Quantity: {itemQty} × ${itemPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 text-sm">
                        ${(itemQty * itemPrice).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Order Footer */}
              <div className="bg-slate-50/50 px-5 py-3.5 border-t border-slate-100 flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium text-xs">Total Amount Paid</span>
                <span className="text-lg font-black text-indigo-600">
                  ${Number(orderTotal).toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Order;
