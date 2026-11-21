import React from "react";
import { Link } from "react-router-dom";
import { HiSparkles } from "react-icons/hi2";
import { FiTruck, FiShield, FiPhoneCall, FiCreditCard } from "react-icons/fi";

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16 border-t border-slate-800">
      {/* Trust Badges */}
      <div className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xl flex-shrink-0">
                <FiTruck />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Free Shipping</h4>
                <p className="text-xs text-slate-400">On all orders over $50</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xl flex-shrink-0">
                <FiShield />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Secure Payments</h4>
                <p className="text-xs text-slate-400">Encrypted Stripe checkout</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xl flex-shrink-0">
                <FiPhoneCall />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">24/7 Support</h4>
                <p className="text-xs text-slate-400">Dedicated expert help</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xl flex-shrink-0">
                <FiCreditCard />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Money Back</h4>
                <p className="text-xs text-slate-400">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white">
                <HiSparkles className="text-lg" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                VOLTIX
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Your premier destination for high-performance audio, premium wearables, 
              cutting-edge mobile tech, and modern electronics.
            </p>
            <div className="text-xs text-slate-500">
              Built with React 19, TypeScript, NestJS & Neon PostgreSQL.
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/product-category?category=airpodes" className="hover:text-indigo-400 transition-colors">
                  Airpods & Earbuds
                </Link>
              </li>
              <li>
                <Link to="/product-category?category=watches" className="hover:text-indigo-400 transition-colors">
                  Smart Watches
                </Link>
              </li>
              <li>
                <Link to="/product-category?category=mobiles" className="hover:text-indigo-400 transition-colors">
                  Mobile Phones
                </Link>
              </li>
              <li>
                <Link to="/product-category?category=televisions" className="hover:text-indigo-400 transition-colors">
                  4K Smart TVs
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/order" className="hover:text-indigo-400 transition-colors">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-indigo-400 transition-colors">
                  View Cart
                </Link>
              </li>
              <li>
                <Link to="/product-category" className="hover:text-indigo-400 transition-colors">
                  Explore All Products
                </Link>
              </li>
              <li>
                <a href="#help" className="hover:text-indigo-400 transition-colors">
                  Warranty & Returns
                </a>
              </li>
            </ul>
          </div>

          {/* Security & Payments */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Security Guarantee
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              All transactions are secured with end-to-end 256-bit SSL encryption powered by Stripe.
            </p>
            <div className="inline-flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-indigo-400 border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Stripe Verified Merchant
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Voltix ElectroMart. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Cookie Preferences</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
