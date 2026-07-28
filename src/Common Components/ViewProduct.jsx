import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Trash2,
  Eye,
  X,
  Loader2,
  Package,
  CheckCircle,
  XCircle,
} from "lucide-react";
import axios from "axios";

export default function ViewProduct() {
  // =====================================================
  // BASE URL
  // =====================================================

  const BaseUrl = import.meta.env.VITE_BASE_URL;

  // =====================================================
  // STATES
  // =====================================================

  const [products, setProducts] = useState([]);

  const [deleteIds, setDeleteIds] = useState([]);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  // =====================================================
  // GET PRODUCTS
  // =====================================================

  const getProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${BaseUrl}/product/view`
      );

      if (response.data.status === 1) {
        setProducts(
          response.data.data || []
        );
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.log(
        "Get Products Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to fetch products."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // PAGE LOAD
  // =====================================================

  useEffect(() => {
    getProducts();
  }, []);

  // =====================================================
  // SEARCH PRODUCTS
  // =====================================================

  const filteredProducts = useMemo(() => {
    const searchValue = search
      .toLowerCase()
      .trim();

    if (!searchValue) {
      return products;
    }

    return products.filter((product) => {
      const productName =
        product.name?.toLowerCase() || "";

      const brandName =
        product.brand?.toLowerCase() || "";

      const parentCategoryName =
        product.parentCategory?.name?.toLowerCase() ||
        "";

      const subCategoryName =
        product.subCategory?.name?.toLowerCase() ||
        "";

      const productCategoryName =
        product.productCategory?.name?.toLowerCase() ||
        "";

      const description =
        product.description?.toLowerCase() || "";

      return (
        productName.includes(searchValue) ||
        brandName.includes(searchValue) ||
        parentCategoryName.includes(searchValue) ||
        subCategoryName.includes(searchValue) ||
        productCategoryName.includes(searchValue) ||
        description.includes(searchValue)
      );
    });
  }, [products, search]);

  // =====================================================
  // SINGLE CHECKBOX
  // =====================================================

  const handleSelect = (e) => {
    const id = e.target.value;

    if (e.target.checked) {
      setDeleteIds((prev) => [
        ...prev,
        id,
      ]);
    } else {
      setDeleteIds((prev) =>
        prev.filter(
          (item) => item !== id
        )
      );
    }
  };

  // =====================================================
  // SELECT ALL
  // =====================================================

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const ids = filteredProducts.map(
        (product) => product._id
      );

      setDeleteIds(ids);
    } else {
      setDeleteIds([]);
    }
  };

  // =====================================================
  // CHECK SELECT ALL
  // =====================================================

  const isAllSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((product) =>
      deleteIds.includes(product._id)
    );

  // =====================================================
  // DELETE PRODUCTS
  // =====================================================

  const deleteProducts = async () => {
    if (deleteIds.length === 0) {
      alert(
        "Please select at least one product."
      );

      return;
    }

    const confirmDelete =
      window.confirm(
        `Are you sure you want to delete ${deleteIds.length} selected product${
          deleteIds.length > 1
            ? "s"
            : ""
        }?`
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeleteLoading(true);

      const response =
        await axios.post(
          `${BaseUrl}/product/delete`,
          {
            ids: deleteIds,
          }
        );

      if (response.data.status === 1) {
        alert(
          response.data.message ||
            "Products deleted successfully."
        );

        setDeleteIds([]);

        // Agar deleted product drawer me open tha
        setSelectedProduct(null);

        getProducts();
      } else {
        alert(
          response.data.message ||
            "Unable to delete products."
        );
      }
    } catch (error) {
      console.log(
        "Delete Products Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Something went wrong while deleting products."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">
          Products
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          View and manage all products
        </p>
      </div>

      {/* =================================================
          MAIN CARD
      ================================================= */}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        {/* =================================================
            TOP FILTER BAR
        ================================================= */}

        <div className="px-4 sm:px-5 py-4 border-b border-slate-100">

          <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">

            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="relative w-full xl:w-96">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search product, brand, category..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-200 transition"
              />

            </div>

            {/* =================================================
                RIGHT ACTIONS
            ================================================= */}

            <div className="flex flex-wrap items-center justify-between xl:justify-end gap-4">

              {/* TOTAL */}

              <div className="text-sm text-slate-500">

                Total:

                <span className="font-semibold text-slate-800 ml-1">
                  {products.length}
                </span>

              </div>

              {/* SEARCH RESULT COUNT */}

              {search && (
                <div className="text-sm text-slate-500">

                  Found:

                  <span className="font-semibold text-slate-800 ml-1">
                    {filteredProducts.length}
                  </span>

                </div>
              )}

              {/* SELECT ALL */}

              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer whitespace-nowrap">

                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  disabled={
                    filteredProducts.length === 0
                  }
                  className="w-4 h-4 accent-slate-700 cursor-pointer"
                />

                Select All

              </label>

              {/* DELETE */}

              <button
                onClick={deleteProducts}
                disabled={
                  deleteIds.length === 0 ||
                  deleteLoading
                }
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white text-sm px-4 py-2.5 rounded-lg transition"
              >

                {deleteLoading ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <Trash2 size={16} />
                )}

                Delete

              </button>

            </div>

          </div>

          {/* =================================================
              SELECTED INFO
          ================================================= */}

          {deleteIds.length > 0 && (
            <div className="mt-3 text-xs text-red-500">

              {deleteIds.length} product
              {deleteIds.length > 1
                ? "s"
                : ""}{" "}
              selected

            </div>
          )}

        </div>

        {/* =================================================
            PRODUCT LIST
        ================================================= */}

        <div className="overflow-x-auto">

          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (

            <div className="flex flex-col items-center justify-center py-16">

              <Loader2
                size={30}
                className="animate-spin text-slate-500"
              />

              <p className="text-sm text-slate-500 mt-3">
                Loading products...
              </p>

            </div>

          ) : filteredProducts.length === 0 ? (

            /* =================================================
                EMPTY STATE
            ================================================= */

            <div className="flex flex-col items-center justify-center py-16 px-5">

              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">

                <Package
                  size={26}
                  className="text-slate-400"
                />

              </div>

              <h3 className="text-base font-semibold text-slate-700 mt-4">
                No products found
              </h3>

              <p className="text-sm text-slate-400 mt-1 text-center">

                {search
                  ? "Try searching with a different product or category name."
                  : "No products are available."}

              </p>

            </div>

          ) : (

            /* =================================================
                PRODUCT LIST
            ================================================= */

            <div>

              {filteredProducts.map(
                (product, index) => (

                  <div
                    key={product._id}
                    className={`flex items-center gap-4 px-4 sm:px-5 py-4 hover:bg-slate-50 transition min-w-[900px] ${
                      index !==
                      filteredProducts.length - 1
                        ? "border-b border-slate-100"
                        : ""
                    }`}
                  >

                    {/* =================================================
                        CHECKBOX
                    ================================================= */}

                    <div className="w-6 flex-shrink-0">

                      <input
                        type="checkbox"
                        value={product._id}
                        checked={deleteIds.includes(
                          product._id
                        )}
                        onChange={handleSelect}
                        className="w-4 h-4 accent-slate-700 cursor-pointer"
                      />

                    </div>

                    {/* =================================================
                        IMAGE
                    ================================================= */}

                    <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-slate-100 overflow-hidden border border-slate-100">

                      <img
                        src={product.image}
                        alt={
                          product.name ||
                          "Product"
                        }
                        className="w-full h-full object-cover"
                      />

                    </div>

                    {/* =================================================
                        PRODUCT INFO
                    ================================================= */}

                    <div className="flex-1 min-w-0">

                      <h2 className="font-semibold text-sm text-slate-800 truncate">

                        {product.name ||
                          "Unnamed Product"}

                      </h2>

                      <p className="text-xs text-slate-500 mt-1">

                        {product.brand ||
                          "No brand"}

                      </p>

                      <p className="text-xs text-slate-400 truncate mt-1">

                        {product.parentCategory
                          ?.name ||
                          "N/A"}

                        {" / "}

                        {product.subCategory
                          ?.name ||
                          "N/A"}

                        {" / "}

                        {product.productCategory
                          ?.name ||
                          "N/A"}

                      </p>

                    </div>

                    {/* =================================================
                        PRICE
                    ================================================= */}

                    <div className="w-28 text-center">

                      <p className="font-semibold text-sm text-slate-800">

                        ₹
                        {product.sellingPrice ||
                          0}

                      </p>

                      <p className="text-xs line-through text-slate-400 mt-1">

                        ₹
                        {product.mrpPrice ||
                          0}

                      </p>

                    </div>

                    {/* =================================================
                        DISCOUNT
                    ================================================= */}

                    <div className="w-24">

                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 whitespace-nowrap">

                        {product.discountPercentage ||
                          0}
                        % OFF

                      </span>

                    </div>

                    {/* =================================================
                        STOCK
                    ================================================= */}

                    <div className="w-24">

                      <span
                        className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ${
                          Number(
                            product.stock
                          ) > 0
                            ? "bg-blue-50 text-blue-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >

                        {product.stock || 0} Stock

                      </span>

                    </div>

                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <div className="w-24">

                      <div className="flex items-center gap-1">

                        {product.active ? (
                          <CheckCircle
                            size={14}
                            className="text-green-500"
                          />
                        ) : (
                          <XCircle
                            size={14}
                            className="text-red-500"
                          />
                        )}

                        <span
                          className={`text-xs font-medium ${
                            product.active
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {product.active
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </div>

                    </div>

                    {/* =================================================
                        VIEW BUTTON
                    ================================================= */}

                    <div className="w-20">

                      <button
                        onClick={() =>
                          setSelectedProduct(
                            product
                          )
                        }
                        className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600 transition"
                      >

                        <Eye size={16} />

                        View

                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

      {/* =================================================
          SELECTED PRODUCT DRAWER
      ================================================= */}

      {selectedProduct && (

        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]"
          onClick={() =>
            setSelectedProduct(null)
          }
        >

          {/* =================================================
              DRAWER
          ================================================= */}

          <div
            className="absolute right-0 top-0 h-full w-full sm:w-[430px] bg-white shadow-2xl overflow-y-auto"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* =================================================
                DRAWER HEADER
            ================================================= */}

            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b bg-white">

              <h2 className="text-lg font-semibold text-slate-800">
                Product Details
              </h2>

              <button
                onClick={() =>
                  setSelectedProduct(null)
                }
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition"
              >

                <X size={18} />

              </button>

            </div>

            {/* =================================================
                DRAWER BODY
            ================================================= */}

            <div className="p-5">

              {/* =================================================
                  PRODUCT IMAGE
              ================================================= */}

              <div className="w-full h-72 rounded-xl bg-slate-100 overflow-hidden">

                <img
                  src={
                    selectedProduct.image
                  }
                  alt={
                    selectedProduct.name ||
                    "Product"
                  }
                  className="w-full h-full object-cover"
                />

              </div>

              {/* =================================================
                  PRODUCT NAME
              ================================================= */}

              <div className="mt-5">

                <h2 className="text-2xl font-semibold text-slate-800">

                  {selectedProduct.name ||
                    "Unnamed Product"}

                </h2>

                <p className="text-sm text-slate-500 mt-1">

                  {selectedProduct.brand ||
                    "No brand"}

                </p>

              </div>

              {/* =================================================
                  PRICE
              ================================================= */}

              <div className="flex flex-wrap items-center gap-3 mt-5">

                <span className="text-2xl font-bold text-green-600">

                  ₹
                  {selectedProduct.sellingPrice ||
                    0}

                </span>

                <span className="line-through text-slate-400">

                  ₹
                  {selectedProduct.mrpPrice ||
                    0}

                </span>

                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">

                  {selectedProduct.discountPercentage ||
                    0}
                  % OFF

                </span>

              </div>

              {/* =================================================
                  INFORMATION
              ================================================= */}

              <div className="mt-7 space-y-4">

                {/* PARENT CATEGORY */}

                <div className="flex justify-between gap-4 text-sm">

                  <span className="text-slate-500">
                    Parent Category
                  </span>

                  <span className="font-medium text-slate-700 text-right">

                    {selectedProduct
                      .parentCategory
                      ?.name ||
                      "N/A"}

                  </span>

                </div>

                {/* SUB CATEGORY */}

                <div className="flex justify-between gap-4 text-sm">

                  <span className="text-slate-500">
                    Sub Category
                  </span>

                  <span className="font-medium text-slate-700 text-right">

                    {selectedProduct
                      .subCategory
                      ?.name ||
                      "N/A"}

                  </span>

                </div>

                {/* PRODUCT CATEGORY */}

                <div className="flex justify-between gap-4 text-sm">

                  <span className="text-slate-500">
                    Product Category
                  </span>

                  <span className="font-medium text-slate-700 text-right">

                    {selectedProduct
                      .productCategory
                      ?.name ||
                      "N/A"}

                  </span>

                </div>

                {/* STOCK */}

                <div className="flex justify-between gap-4 text-sm">

                  <span className="text-slate-500">
                    Stock
                  </span>

                  <span className="font-medium text-slate-700">

                    {selectedProduct.stock ||
                      0}

                  </span>

                </div>

                {/* COUNTRY */}

                <div className="flex justify-between gap-4 text-sm">

                  <span className="text-slate-500">
                    Country
                  </span>

                  <span className="font-medium text-slate-700 text-right">

                    {selectedProduct.countryOfOrigin ||
                      "N/A"}

                  </span>

                </div>

                {/* STATUS */}

                <div className="flex justify-between gap-4 text-sm">

                  <span className="text-slate-500">
                    Status
                  </span>

                  <span
                    className={`font-medium ${
                      selectedProduct.active
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >

                    {selectedProduct.active
                      ? "Active"
                      : "Inactive"}

                  </span>

                </div>

              </div>

              {/* =================================================
                  SIZES
              ================================================= */}

              <div className="mt-7">

                <h3 className="font-medium text-slate-700 mb-3">
                  Available Sizes
                </h3>

                {selectedProduct.sizes
                  ?.length > 0 ? (

                  <div className="flex flex-wrap gap-2">

                    {selectedProduct.sizes.map(
                      (size, index) => (

                        <span
                          key={`${size}-${index}`}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 text-sm text-slate-700"
                        >
                          {size}
                        </span>

                      )
                    )}

                  </div>

                ) : (

                  <p className="text-sm text-slate-400">
                    No sizes available.
                  </p>

                )}

              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <div className="mt-7">

                <h3 className="font-medium text-slate-700 mb-2">
                  Description
                </h3>

                <p className="text-sm text-slate-500 leading-6">

                  {selectedProduct.description ||
                    "No description available."}

                </p>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}