import React, { useEffect, useState } from "react";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApiSummary from "./BackendUrl/backendUrl";
import ContextApi from "./Context/Contex";
import { useDispatch } from "react-redux";
import { setUserDetails } from "./store/userSlice";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const [cartProductCount, setCartProductCart] = useState<number>(0);

  // user details
  const fetchUserDetails = async (): Promise<void> => {
    try {
      const dataResponse = await fetch(ApiSummary.current_user.url, {
        method: ApiSummary.current_user.method,
        credentials: "include",
      });
      if (!dataResponse.ok) return;
      const userData = await dataResponse.json();
      if (userData.success) {
        dispatch(setUserDetails(userData.data));
      }
    } catch (err) {
      dispatch(setUserDetails(null));
    }
  };

  // user cart count
  const fetchAddToCart = async (): Promise<void> => {
    try {
      const dataResponse = await fetch(ApiSummary.countAddToCart.url, {
        method: ApiSummary.countAddToCart.method,
        credentials: "include",
      });
      if (!dataResponse.ok) return;
      const userData = await dataResponse.json();
      if (userData.success && userData.data) {
        setCartProductCart(userData.data.count || 0);
      }
    } catch (err) {
      setCartProductCart(0);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchAddToCart();
  }, []);

  return (
    <ContextApi.Provider
      value={{ fetchUserDetails, cartProductCount, fetchAddToCart }}
    >
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
        <ToastContainer position="top-right" autoClose={3000} theme="light" />
        <Header />
        <main className="flex-1 pt-20 pb-12">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ContextApi.Provider>
  );
};

export default App;
