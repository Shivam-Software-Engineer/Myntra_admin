import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Trash2, Eye, X } from "lucide-react";

export default function ViewProduct() {
    const BaseUrl = import.meta.env.VITE_BASE_URL;

    const [products, setProducts] = useState([]);
    const [deleteIds, setDeleteIds] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // ---------------- FETCH PRODUCTS ----------------
    const getProducts = () => {
        axios
            .get(`${BaseUrl}/product/view`)
            .then((res) => {
                setProducts(res.data.data);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        getProducts();
    }, []);

    // ---------------- CHECKBOX ----------------
    const handleSelect = (e) => {
        const id = e.target.value;

        if (e.target.checked) {
            setDeleteIds([...deleteIds, id]);
        } else {
            setDeleteIds(deleteIds.filter((item) => item !== id));
        }
    };

    // ---------------- SELECT ALL ----------------
    const selectAll = (e) => {
        if (e.target.checked) {
            setDeleteIds(products.map((p) => p._id));
        } else {
            setDeleteIds([]);
        }
    };

    // ---------------- DELETE ----------------
    const deleteProducts = () => {
        if (deleteIds.length === 0) {
            alert("Select products first");
            return;
        }

        if (confirm("Delete selected products?")) {
            axios
                .post(`${BaseUrl}/product/delete`, {
                    ids: deleteIds,
                })
                .then(() => {
                    setDeleteIds([]);
                    getProducts();
                })
                .catch((err) => console.log(err));
        }
    };

    return (
  <>
    <div className="min-h-screen bg-slate-100 p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Products
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View and manage all products
          </p>
        </div>
      </div>

      {/* Top Bar */}

      <div className="bg-white rounded-xl px-5 py-4 flex flex-wrap justify-between items-center gap-4 shadow-sm">

        <div className="relative w-full md:w-80">

          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-slate-50 rounded-lg pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-300"
          />

        </div>

        <div className="flex items-center gap-5">

          <label className="flex items-center gap-2 text-sm cursor-pointer">

            <input
              type="checkbox"
              checked={
                products.length > 0 &&
                deleteIds.length === products.length
              }
              onChange={selectAll}
            />

            Select All

          </label>

          <button
            onClick={deleteProducts}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition"
          >
            <Trash2 size={16} />
            Delete
          </button>

        </div>

      </div>

      {/* Product List */}

      <div className="mt-6 bg-white rounded-xl overflow-hidden shadow-sm">

        {products.map((product, index) => (

          <div
            key={product._id}
            className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition ${
              index !== products.length - 1
                ? "border-b border-slate-100"
                : ""
            }`}
          >

            {/* Checkbox */}

            <input
              type="checkbox"
              value={product._id}
              checked={deleteIds.includes(product._id)}
              onChange={handleSelect}
              className="w-4 h-4"
            />

            {/* Image */}

            <img
              src={product.image}
              alt=""
              className="w-16 h-16 rounded-lg object-cover bg-slate-100"
            />

            {/* Product Info */}

            <div className="flex-1 min-w-0">

              <h2 className="font-semibold text-slate-800 truncate">
                {product.name}
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                {product.brand}
              </p>

              <p className="text-xs text-slate-400 truncate mt-1">
                {product.parentCategory?.name}
                {" / "}
                {product.subCategory?.name}
                {" / "}
                {product.productCategory?.name}
              </p>

            </div>

            {/* Price */}

            <div className="hidden md:block w-28 text-center">

              <p className="font-semibold text-slate-800">
                ₹{product.sellingPrice}
              </p>

              <p className="text-xs line-through text-slate-400">
                ₹{product.mrpPrice}
              </p>

            </div>

            {/* Discount */}

            <div className="hidden lg:block w-24">

              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                {product.discountPercentage}% OFF
              </span>

            </div>

            {/* Stock */}

            <div className="hidden md:block w-24">

              <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                {product.stock} Stock
              </span>

            </div>

            {/* View */}

            <button
              onClick={() => setSelectedProduct(product)}
              className="flex items-center gap-1 text-sm text-slate-600 hover:text-blue-600 transition"
            >
              <Eye size={16} />
              View
            </button>

          </div>

        ))}

      </div>

    </div>

    {/* Drawer Start */}
    {selectedProduct && (      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]">

        {/* Drawer */}

        <div className="absolute right-0 top-0 h-full w-full sm:w-[430px] bg-white shadow-2xl overflow-y-auto">

          {/* Header */}

          <div className="flex items-center justify-between px-5 py-4 border-b">

            <h2 className="text-lg font-semibold text-slate-800">
              Product Details
            </h2>

            <button
              onClick={() => setSelectedProduct(null)}
              className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition"
            >
              <X size={18} />
            </button>

          </div>

          {/* Body */}

          <div className="p-5">

            {/* Image */}

            <img
              src={selectedProduct.image}
              alt=""
              className="w-full h-72 rounded-xl object-cover bg-slate-100"
            />

            {/* Name */}

            <div className="mt-5">

              <h2 className="text-2xl font-semibold text-slate-800">
                {selectedProduct.name}
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {selectedProduct.brand}
              </p>

            </div>

            {/* Price */}

            <div className="flex items-center gap-3 mt-5">

              <span className="text-2xl font-bold text-green-600">
                ₹{selectedProduct.sellingPrice}
              </span>

              <span className="line-through text-slate-400">
                ₹{selectedProduct.mrpPrice}
              </span>

              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {selectedProduct.discountPercentage}% OFF
              </span>

            </div>

            {/* Information */}

            <div className="mt-7 space-y-4">

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Parent Category</span>
                <span className="font-medium">
                  {selectedProduct.parentCategory?.name}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Sub Category</span>
                <span className="font-medium">
                  {selectedProduct.subCategory?.name}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Product Category</span>
                <span className="font-medium">
                  {selectedProduct.productCategory?.name}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Stock</span>
                <span className="font-medium">
                  {selectedProduct.stock}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Country</span>
                <span className="font-medium">
                  {selectedProduct.countryOfOrigin}
                </span>
              </div>

            </div>

            {/* Sizes */}

            <div className="mt-7">

              <h3 className="font-medium text-slate-700 mb-3">
                Available Sizes
              </h3>

              <div className="flex flex-wrap gap-2">

                {selectedProduct.sizes?.map((size) => (

                  <span
                    key={size}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 text-sm text-slate-700"
                  >
                    {size}
                  </span>

                ))}

              </div>

            </div>

            {/* Description */}

            <div className="mt-7">

              <h3 className="font-medium text-slate-700 mb-2">
                Description
              </h3>

              <p className="text-sm text-slate-500 leading-6">
                {selectedProduct.description || "No description available."}
              </p>

            </div>

          </div>

        </div>

      </div>
    )}

  </>
);
}