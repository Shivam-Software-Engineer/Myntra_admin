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

export default function AddSubCategory() {
    const BaseUrl = import.meta.env.VITE_BASE_URL;
    let [parentCategoryInitial, setParentCategoryInitial] = useState([]);

    let subCategoryId = useParams().id;
    const [parentCategory, setParentCategory] = useState("");
    const [subCategoryName, setSubCategoryName] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const options = parentCategoryInitial.map((item) => ({
        value: item._id,
        label: item.name,
    }));

    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // Static categories (replace with API later)
    const categories = [
        "Electronics",
        "Fashion",
        "Furniture",
        "Sports",
        "Books",
    ];

    const handleSubmit = async () => {
        if (!parentCategory || !subCategoryName.trim() || !imageUrl.trim()) {
            setErrorMsg("Please fill all fields.");
            setSuccessMsg("");
            return;
        }

        try {
            setLoading(true);
            setErrorMsg("");
            setSuccessMsg("");


            await axios.post(`${BaseUrl}/subcategory/add`, {
                parentCategory,
                name: subCategoryName,
                image: imageUrl,
            });

            setSuccessMsg("Sub Category added successfully.");
            setParentCategory("");
            setSubCategoryName("");
            setImageUrl("");
        } catch (err) {
            setErrorMsg("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    let getParentCategories = () => {
        axios.get(`${BaseUrl}/subcategory/parent-category`)
            .then((res) => res.data)
            .then((finalRes) => {
             
                setParentCategoryInitial(finalRes.data);
            });
    };

     const updateSubCategory = () => {
        if (!subCategoryName.trim() || !imageUrl.trim()) {
            setErrorMsg("Please fill all fields.");
            setSuccessMsg("");
            return;
        }

        setLoading(true);
        setSuccessMsg("");
        setErrorMsg("");

        axios
            .put(`${BaseUrl}/subcategory/update/${subCategoryId}`, {
                parentCategory,
                name: subCategoryName,
                image: imageUrl,
            })
            .then((res) => {
                

                setSuccessMsg("Sub Category updated successfully.");
                setErrorMsg("");

                setSubCategoryName("");
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
        getParentCategories();
    }, []);

useEffect(() => {
    if (subCategoryId) {
        axios
            .get(`${BaseUrl}/subcategory/view/${subCategoryId}`)
            .then((res) => res.data)
            .then((finalRes) => {
                const data = finalRes.data[0];

                setParentCategory(data.parentCategory._id);
                setSubCategoryName(data.name);
                setImageUrl(data.image);
            })
            .catch((err) => {
                console.log(err);
                setErrorMsg("Failed to fetch sub category data.");
            });
    } else {
        // Reset for Add Sub Category
        setParentCategory("");
        setSubCategoryName("");
        setImageUrl("");
    }
}, [subCategoryId]);

    return (
        <div className="min-h-screen bg-[#f5f7fb] p-8">

            {/* Heading */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-slate-800">
                  {subCategoryId ? "Edit Sub Category" : "Add Sub Category"}  
                </h1>

                <p className="text-gray-500 mt-2">
                  {subCategoryId ? "Update sub category for your products." : "Create a new sub category for your products."}    
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

                <div className="grid lg:grid-cols-2 gap-10">

                    {/* Left */}
                    <div>

                        <h2 className="text-xl font-semibold text-slate-800 mb-6">
                            Sub Category Details
                        </h2>

                        {successMsg && (
                            <div className="mb-5 flex gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                                <CheckCircle className="text-green-600 mt-1" size={22} />
                                <div>
                                    <h3 className="font-semibold text-green-700">Success</h3>
                                    <p className="text-sm text-green-600">{successMsg}</p>
                                </div>
                            </div>
                        )}

                        {errorMsg && (
                            <div className="mb-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                                <AlertCircle className="text-red-600 mt-1" size={22} />
                                <div>
                                    <h3 className="font-semibold text-red-700">Error</h3>
                                    <p className="text-sm text-red-600">{errorMsg}</p>
                                </div>
                            </div>
                        )}

                        {/* Parent Category */}

                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium">
                                Parent Category
                            </label>

                            <Select
                                options={options}
                                value={options.find((item) => item.value === parentCategory) || null}
                                onChange={(selectedOption) =>
                                    setParentCategory(selectedOption.value)
                                }
                                placeholder="Select Parent Category"
                                isSearchable={false} // Search remove
                                styles={{
                                    control: (base) => ({
                                        ...base,

                                        borderRadius: "12px",

                                        boxShadow: "none",

                                    }),
                                    menu: (base) => ({
                                        ...base,

                                        overflow: "hidden",
                                    }),
                                    option: (base, state) => ({
                                        ...base,

                                        cursor: "pointer",

                                    }),
                                }}
                            />
                        </div>

                        {/* Sub Category */}

                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium">
                                Sub Category Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter sub category name"
                                value={subCategoryName}
                                onChange={(e) => setSubCategoryName(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        {/* Image URL */}

                        <div className="mb-8">
                            <label className="block mb-2 text-sm font-medium">
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

                        <button
                            onClick={subCategoryId ? updateSubCategory : handleSubmit}
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

                                    {subCategoryId ? "Updating..." : "Adding..."}
                                </>
                            ) : (
                                <>
                                    <PlusCircle size={20} />

                                    {subCategoryId ? "Update Sub Category" : "Add Sub Category"}
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
                                    <ImageIcon size={70} className="mx-auto mb-4" />
                                    <p className="text-lg">Image Preview</p>
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