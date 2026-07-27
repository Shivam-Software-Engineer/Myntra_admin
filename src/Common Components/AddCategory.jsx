import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    PlusCircle,
    Image as ImageIcon,
    CheckCircle,
    AlertCircle,
    Loader2,
} from "lucide-react";
import { useParams } from "react-router";

export default function AddCategory() {
    const [categoryName, setCategoryName] = useState("");
    const BaseUrl = import.meta.env.VITE_BASE_URL;
    const [imageUrl, setImageUrl] = useState("");
    let categoryId = useParams().id;
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = () => {
        if (!categoryName.trim() || !imageUrl.trim()) {
            setErrorMsg("Please fill all fields.");
            setSuccessMsg("");
            return;
        }

        setLoading(true);
        setSuccessMsg("");
        setErrorMsg("");

        axios
            .post(`${BaseUrl}/category/add`, {
                name: categoryName,
                image: imageUrl,
            })
            .then((res) => {
                console.log(res.data);

                setSuccessMsg("Category added successfully.");
                setErrorMsg("");

                setCategoryName("");
                setImageUrl("");
            })
            .catch((err) => {
                console.log(err);

                setErrorMsg("Something went wrong. Please try again.");
                setSuccessMsg("");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const updateCategory = () => {
        if (!categoryName.trim() || !imageUrl.trim()) {
            setErrorMsg("Please fill all fields.");
            setSuccessMsg("");
            return;
        }

        setLoading(true);
        setSuccessMsg("");
        setErrorMsg("");

        axios
            .put(`${BaseUrl}/category/update/${categoryId}`, {
                name: categoryName,
                image: imageUrl,
            })
            .then((res) => {
                console.log(res.data);

                setSuccessMsg("Category updated successfully.");
                setErrorMsg("");

                setCategoryName("");
                setImageUrl("");
            })
            .catch((err) => {
                console.log(err);

                setErrorMsg("Something went wrong. Please try again.");
                setSuccessMsg("");
            })
            .finally(() => {
                setLoading(false);
            });
    };


    useEffect(() => {
        if (categoryId) {
            axios
                .get(`${BaseUrl}/category/view/${categoryId}`)
                .then((res) => {
                    const singleCategoryData = res.data.data[0];
                    setCategoryName(singleCategoryData.name);
                    setImageUrl(singleCategoryData.image);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setCategoryName("");
            setImageUrl("");
            setSuccessMsg("");
            setErrorMsg("");
        }
    }, [categoryId, BaseUrl]);

    return (
        <div className="min-h-screen bg-[#f5f7fb] p-8">
            {/* Heading */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-slate-800">
                    {categoryId ? "Edit Category" : "Add Category"}
                </h1>

                <p className="text-gray-500 mt-2">
                    {categoryId ? "Update category for your products." : "Create a new category for your products."}
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="grid lg:grid-cols-2 gap-10">
                    {/* Left */}
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800 mb-6">
                            Category Details
                        </h2>

                        {/* Success */}
                        {successMsg && (
                            <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                                <CheckCircle
                                    className="text-green-600 mt-0.5"
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
                            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                                <AlertCircle
                                    className="text-red-600 mt-0.5"
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

                        {/* Category */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter category name"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        {/* Image URL */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Image URL
                            </label>

                            <input
                                type="text"
                                placeholder="https://example.com/image.jpg"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        {/* Button */}
                        <button
                            onClick={categoryId ? updateCategory : handleSubmit}
                            disabled={loading}
                            className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition-all ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-teal-500 hover:bg-teal-600"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2
                                        size={20}
                                        className="animate-spin"
                                    />

                                    {categoryId ? "Updating..." : "Adding..."}
                                </>
                            ) : (
                                <>
                                    <PlusCircle size={20} />

                                    {categoryId ? "Update Category" : "Add Category"}
                                </>
                            )}
                        </button>
                    </div>

                    {/* Right */}
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800 mb-6">
                            Image Preview
                        </h2>

                        <div className="h-[350px] rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">
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
                                        size={70}
                                        className="mx-auto mb-4"
                                    />

                                    <p className="text-lg">
                                        Image Preview
                                    </p>

                                    <p className="text-sm">
                                        Paste an image URL to preview it here
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}