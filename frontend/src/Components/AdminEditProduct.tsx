import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import productCategory from "../../helper/ProductCategory";
import { FaCloudUploadAlt } from "react-icons/fa";
import UploadImage from "../../helper/UploadImage";
import DisplayFullScreenImage from "./DisplayFullScreenImage";
import { MdDelete } from "react-icons/md";
import ApiSummary from "../BackendUrl/backendUrl";
import { toast } from "react-toastify";
import { FiEdit2 } from "react-icons/fi";
import { Product } from "../types";

interface AdminEditProductProps {
  productData: Product | any;
  onClose: () => void;
  fetchAllProduct: () => void;
}

const AdminEditProduct: React.FC<AdminEditProductProps> = ({
  productData,
  onClose,
  fetchAllProduct,
}) => {
  const [openFullImage, setOpenFullImage] = useState(false);
  const [urlFullImage, setUrlFullImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [data, setData] = useState({
    ...productData,
    _id: productData._id || productData.id,
    productName: productData.productName || "",
    brandName: productData.brandName || "",
    category: productData.category || "",
    productImage: productData.productImage || ([] as string[]),
    description: productData.description || "",
    price: productData.price || "",
    sellingPrice: productData.sellingPrice || "",
  });

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleUploadProduct = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const cloudinaryImage = await UploadImage(file);
      if (cloudinaryImage?.url) {
        setData((prev: any) => ({
          ...prev,
          productImage: [...prev.productImage, cloudinaryImage.url],
        }));
        toast.success("Image uploaded!");
      }
    } catch (err: any) {
      console.error("Image upload failed:", err);
      toast.error(err?.message || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = (index: number) => {
    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);
    setData((prev: any) => ({ ...prev, productImage: newProductImage }));
  };

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (data.productImage.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }

    try {
      setSubmitting(true);
      const fetchData = await fetch(ApiSummary.updateaProduct.url, {
        method: ApiSummary.updateaProduct.method,
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...data,
          price: Number(data.price),
          sellingPrice: Number(data.sellingPrice),
        }),
      });
      const responseData = await fetchData.json();

      if (responseData.success) {
        toast.success(responseData.message || "Product updated successfully!");
        onClose();
        fetchAllProduct();
      } else {
        toast.error(responseData.message || "Failed to update product.");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Network error while updating product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm">
              <FiEdit2 />
            </div>
            <h2 className="text-base font-bold text-slate-900">Edit Product</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <CgClose className="text-lg" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleOnSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Product Name */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-600 mb-1" htmlFor="productName">
              Product Title *
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={data.productName}
              onChange={handleOnChange}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 transition-all"
            />
          </div>

          {/* Brand & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-600 mb-1" htmlFor="brandName">
                Brand Name *
              </label>
              <input
                type="text"
                id="brandName"
                name="brandName"
                value={data.brandName}
                onChange={handleOnChange}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 transition-all"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-600 mb-1" htmlFor="category">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={data.category}
                onChange={handleOnChange}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 transition-all"
              >
                <option value="">Select Category</option>
                {productCategory.map((el, index) => (
                  <option value={el.value} key={index}>
                    {el.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Product Images
            </label>
            <label
              htmlFor="editUploadImage"
              className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/20 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors"
            >
              <FaCloudUploadAlt className="text-3xl text-indigo-500 mb-2" />
              <p className="font-semibold text-slate-700">
                {uploadingImage ? "Uploading to Cloudinary..." : "Click to upload more images"}
              </p>
              <input
                id="editUploadImage"
                type="file"
                accept="image/*"
                hidden
                onChange={handleUploadProduct}
                disabled={uploadingImage}
              />
            </label>

            {/* Uploaded Previews */}
            <div className="flex flex-wrap gap-2.5 mt-3">
              {data.productImage.map((img: string, index: number) => (
                <div
                  key={index}
                  className="relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-50"
                >
                  <img
                    onClick={() => {
                      setOpenFullImage(true);
                      setUrlFullImage(img);
                    }}
                    src={img}
                    alt="Product preview"
                    className="w-full h-full object-contain p-1 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index)}
                    aria-label="Delete image"
                    className="absolute top-1 right-1 w-5 h-5 bg-rose-500 text-white rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <MdDelete className="text-xs" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-600 mb-1" htmlFor="price">
                Regular Price ($) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={data.price}
                onChange={handleOnChange}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 transition-all"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-600 mb-1" htmlFor="sellingPrice">
                Selling / Discounted Price ($) *
              </label>
              <input
                type="number"
                id="sellingPrice"
                name="sellingPrice"
                value={data.sellingPrice}
                onChange={handleOnChange}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-600 mb-1" htmlFor="description">
              Product Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={data.description}
              onChange={handleOnChange}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="px-6 py-2.5 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25 transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>

      {openFullImage && (
        <DisplayFullScreenImage
          onClose={() => setOpenFullImage(false)}
          imgeUrl={urlFullImage}
        />
      )}
    </div>
  );
};

export default AdminEditProduct;
