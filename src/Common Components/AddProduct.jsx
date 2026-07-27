import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import {
  PlusCircle,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useParams } from "react-router";

export default function AddProduct() {
  const BaseUrl = import.meta.env.VITE_BASE_URL;
  const { id: productId } = useParams();

  // ===========================
  // Product States
  // ===========================

  const [parentCategory, setParentCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [productCategory, setProductCategory] = useState("");

  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [mrpPrice, setMrpPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [stock, setStock] = useState("");

  const [description, setDescription] = useState("");

  const [sizes, setSizes] = useState([]);

  const [active, setActive] = useState(true);

  // ===========================
  // Lists
  // ===========================

  const [parentCategoryList, setParentCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [productCategoryList, setProductCategoryList] = useState([]);

  // ===========================
  // UI States
  // ===========================

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // ===========================
  // React Select Options
  // ===========================

  const parentOptions = parentCategoryList.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const subOptions = subCategoryList.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const productCategoryOptions = productCategoryList.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const sizeOptions = [
    { value: "XS", label: "XS" },
    { value: "S", label: "S" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
    { value: "XL", label: "XL" },
    { value: "XXL", label: "XXL" },
    { value: "Free Size", label: "Free Size" },
  ];

  // ===========================
  // Discount Calculation
  // ===========================

  const discountPercentage =
    mrpPrice && sellingPrice
      ? Math.round(((mrpPrice - sellingPrice) / mrpPrice) * 100)
      : 0;

  // ===========================
  // Get Parent Categories
  // ===========================

  const getParentCategories = () => {
    axios
      .get(`${BaseUrl}/subcategory/parent-category`)
      .then((res) => res.data)
      .then((finalRes) => {
        setParentCategoryList(finalRes.data);
      })
      .catch(console.log);
  };

  // ===========================
  // Get Sub Categories
  // ===========================

  const getSubCategories = (parentId) => {
    axios
      .get(`${BaseUrl}/productcategory/view-subcategory/${parentId}`)
      .then((res) => res.data)
      .then((finalRes) => {
        setSubCategoryList(finalRes.data);
      })
      .catch(console.log);
  };

  // ===========================
  // Get Product Categories
  // ===========================

  const getProductCategories = (subCategoryId) => {
    axios
      .get(`${BaseUrl}/product/view-productcategory/${subCategoryId}`)
      .then((res) => res.data)
      .then((finalRes) => {
        setProductCategoryList(finalRes.data);
      })
      .catch(console.log);
  };

  // ===========================
  // Add Product
  // ===========================

  const addProduct = () => {
    setSuccessMsg("");
    setErrorMsg("");
    

    if (
      !parentCategory ||
      !subCategory ||
      !productCategory ||
      !productName.trim() ||
      !brand.trim() ||
      !imageUrl.trim() ||
      !mrpPrice ||
      !sellingPrice ||
      !stock ||
      !description.trim()
    ) {
      setErrorMsg("Please fill all required fields.");
      return;
    }

    setLoading(true);

    axios
      .post(`${BaseUrl}/product/add`, {
        parentCategory,
        subCategory,
        productCategory,

        name: productName,
        brand,
        image: imageUrl,

        mrpPrice,
        sellingPrice,
        discountPercentage,

        stock,
        description,

        sizes,

        active,
      })
      .then(() => {
        setSuccessMsg("Product Added Successfully.");

        setParentCategory("");
        setSubCategory("");
        setProductCategory("");

        setProductName("");
        setBrand("");
        setImageUrl("");

        setMrpPrice("");
        setSellingPrice("");
        setStock("");

        setDescription("");

        setSizes([]);

        setActive(true);

        setSubCategoryList([]);
        setProductCategoryList([]);
      })
      .catch(() => {
        setErrorMsg("Something went wrong.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // ===========================
  // Update Product
  // ===========================

  const updateProduct = () => {
    setLoading(true);

    axios
      .put(`${BaseUrl}/product/update/${productId}`, {
        parentCategory,
        subCategory,
        productCategory,

        name: productName,
        brand,
        image: imageUrl,

        mrpPrice,
        sellingPrice,
        discountPercentage,

        stock,
        description,

        sizes,

        active,
      })
      .then(() => {
        setSuccessMsg("Product Updated Successfully.");
        setParentCategory("");
        setSubCategory("");
        setProductCategory("");

        setProductName("");
        setBrand("");
        setImageUrl("");

        setMrpPrice("");
        setSellingPrice("");
        setStock("");

        setDescription("");

        setSizes([]);

        setActive(true);

        setSubCategoryList([]);
        setProductCategoryList([])
      })
      .catch(() => {
        setErrorMsg("Something went wrong.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // ===========================
  // Initial Load
  // ===========================

  useEffect(() => {
    getParentCategories();
  }, []);

  // ===========================
  // Edit Product
  // ===========================

useEffect(() => {
  if (productId) {
    axios
      .get(`${BaseUrl}/product/view/${productId}`)
      .then((res) => res.data)
      .then((finalRes) => {
        const data = finalRes.data[0];

        setParentCategory(data.parentCategory._id);

        getSubCategories(data.parentCategory._id);

        setTimeout(() => {
          setSubCategory(data.subCategory._id);

          getProductCategories(data.subCategory._id);

          setTimeout(() => {
            setProductCategory(data.productCategory._id);
          }, 300);
        }, 300);

        setProductName(data.name);
        setBrand(data.brand);
        setImageUrl(data.image);

        setMrpPrice(data.mrpPrice);
        setSellingPrice(data.sellingPrice);

        setStock(data.stock);
        setDescription(data.description);

        setSizes(data.sizes || []);
        setActive(data.active);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    // Reset for Add Product
    setParentCategory("");
    setSubCategory("");
    setProductCategory("");

    setProductName("");
    setBrand("");
    setImageUrl("");

    setMrpPrice("");
    setSellingPrice("");
    setStock("");

    setDescription("");

    setSizes([]);

    setActive(true);

    setSubCategoryList([]);
    setProductCategoryList([]);
  }
}, [productId]);
  return (
  <div className="min-h-screen bg-[#f5f7fb] p-8">

    {/* Heading */}

    <div className="mb-8">
      <h1 className="text-4xl font-bold text-slate-800">
        {productId ? "Edit Product" : "Add Product"}
      </h1>

      <p className="text-gray-500 mt-2">
        {productId
          ? "Update your product details."
          : "Create a new product."}
      </p>
    </div>

    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

      <div className="grid lg:grid-cols-2 gap-10">

        {/* ================= LEFT ================= */}

        <div>

          <h2 className="text-xl font-semibold text-slate-800 mb-6">
            Product Details
          </h2>

          {/* Success */}

          {successMsg && (
            <div className="mb-5 flex gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
              <CheckCircle
                className="text-green-600 mt-1"
                size={22}
              />

              <div>
                <h3 className="font-semibold text-green-700">
                  Success
                </h3>

                <p className="text-sm text-green-600">
                  {successMsg}
                </p>
              </div>
            </div>
          )}

          {/* Error */}

          {errorMsg && (
            <div className="mb-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <AlertCircle
                className="text-red-600 mt-1"
                size={22}
              />

              <div>
                <h3 className="font-semibold text-red-700">
                  Error
                </h3>

                <p className="text-sm text-red-600">
                  {errorMsg}
                </p>
              </div>
            </div>
          )}

          {/* Parent Category */}

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">
              Parent Category
            </label>

            <Select
              options={parentOptions}
              value={
                parentOptions.find(
                  (item) => item.value === parentCategory
                ) || null
              }
              onChange={(selected) => {

                setParentCategory(selected.value);

                setSubCategory("");

                setProductCategory("");

                setSubCategoryList([]);

                setProductCategoryList([]);

                getSubCategories(selected.value);
              }}
              placeholder="Select Parent Category"
            />
          </div>

          {/* Sub Category */}

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">
              Sub Category
            </label>

            <Select
              options={subOptions}
              value={
                subOptions.find(
                  (item) => item.value === subCategory
                ) || null
              }
              onChange={(selected) => {

                setSubCategory(selected.value);

                setProductCategory("");

                setProductCategoryList([]);

                getProductCategories(selected.value);

              }}
              placeholder="Select Sub Category"
            />
          </div>

          {/* Product Category */}

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">
              Product Category
            </label>

            <Select
              options={productCategoryOptions}
              value={
                productCategoryOptions.find(
                  (item) => item.value === productCategory
                ) || null
              }
              onChange={(selected) =>
                setProductCategory(selected.value)
              }
              placeholder="Select Product Category"
            />
          </div>

          {/* Product Name */}

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">
              Product Name
            </label>

            <input
              type="text"
              value={productName}
              onChange={(e) =>
                setProductName(e.target.value)
              }
              placeholder="Enter Product Name"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Brand */}

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">
              Brand
            </label>

            <input
              type="text"
              value={brand}
              onChange={(e) =>
                setBrand(e.target.value)
              }
              placeholder="Nike / Puma / Roadster"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Image */}

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">
              Product Image URL
            </label>

            <input
              type="text"
              value={imageUrl}
              onChange={(e) =>
                setImageUrl(e.target.value)
              }
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Pricing */}

          <div className="grid grid-cols-2 gap-5">

            {/* MRP */}

            <div>
              <label className="block mb-2 text-sm font-medium">
                MRP Price
              </label>

              <input
                type="number"
                value={mrpPrice}
                onChange={(e) =>
                  setMrpPrice(e.target.value)
                }
                placeholder="MRP Price"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Selling */}

            <div>
              <label className="block mb-2 text-sm font-medium">
                Selling Price
              </label>

              <input
                type="number"
                value={sellingPrice}
                onChange={(e) =>
                  setSellingPrice(e.target.value)
                }
                placeholder="Selling Price"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

          </div>

          {/* Discount */}

          <div className="mt-6">
            <label className="block mb-2 text-sm font-medium">
              Discount Percentage
            </label>

            <input
              type="text"
              readOnly
              value={`${discountPercentage}%`}
              className="w-full rounded-xl bg-gray-100 border border-gray-300 px-4 py-3"
            />
          </div>

                    {/* Stock */}

          <div className="mt-6">
            <label className="block mb-2 text-sm font-medium">
              Stock Quantity
            </label>

            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Enter Stock"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Description */}

          <div className="mt-6">
            <label className="block mb-2 text-sm font-medium">
              Product Description
            </label>

            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Product Description"
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Sizes */}

          <div className="mt-6">
            <label className="block mb-2 text-sm font-medium">
              Available Sizes
            </label>

            <Select
              options={sizeOptions}
              isMulti
              closeMenuOnSelect={false}
              value={sizeOptions.filter((item) =>
                sizes.includes(item.value)
              )}
              onChange={(selected) =>
                setSizes(selected.map((item) => item.value))
              }
              placeholder="Select Sizes"
            />
          </div>

          {/* Status */}

          <div className="mt-6">
            <label className="block mb-2 text-sm font-medium">
              Status
            </label>

            <select
              value={active ? "true" : "false"}
              onChange={(e) =>
                setActive(e.target.value === "true")
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {/* Button */}

          <button
            onClick={productId ? updateProduct : addProduct}
            disabled={loading}
            className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition-all ${
              loading
                ? "cursor-not-allowed bg-gray-400"
                : "bg-teal-500 hover:bg-teal-600"
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />

                {productId ? "Updating..." : "Adding..."}
              </>
            ) : (
              <>
                <PlusCircle size={20} />

                {productId
                  ? "Update Product"
                  : "Add Product"}
              </>
            )}
          </button>
        </div>

        {/* ================= RIGHT ================= */}

        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-6">
            Image Preview
          </h2>

          <div className="h-[500px] rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">

            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/600x400?text=Invalid+Image";
                }}
              />
            ) : (
              <div className="text-center text-gray-400">
                <ImageIcon
                  size={80}
                  className="mx-auto mb-4"
                />

                <p className="text-lg font-medium">
                  Product Image Preview
                </p>

                <p className="text-sm mt-2">
                  Paste image URL to preview
                </p>
              </div>
            )}
          </div>

          {/* Product Summary */}

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Product Summary
            </h3>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-500">Product</span>
                <span className="font-semibold">
                  {productName || "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Brand</span>
                <span className="font-semibold">
                  {brand || "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">MRP</span>
                <span className="font-semibold">
                  ₹ {mrpPrice || 0}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Selling Price
                </span>
                <span className="font-semibold text-green-600">
                  ₹ {sellingPrice || 0}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Discount
                </span>
                <span className="font-semibold text-red-500">
                  {discountPercentage}%
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Stock</span>
                <span className="font-semibold">
                  {stock || 0}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>

                <span
                  className={`font-semibold ${
                    active
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {active ? "Active" : "Inactive"}
                </span>
              </div>

              <div>
                <span className="text-gray-500">
                  Sizes
                </span>

                <div className="flex flex-wrap gap-2 mt-2">

                  {sizes.length > 0 ? (
                    sizes.map((size) => (
                      <span
                        key={size}
                        className="rounded-md bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700"
                      >
                        {size}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">
                      No Size Selected
                    </span>
                  )}

                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>
);
}