import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Pencil,
  Trash2,
  Loader2,
  Layers,
  CheckCircle,
  XCircle,
} from "lucide-react";
import axios from "axios";
import { Link } from "react-router";

export default function ViewSubCategory() {
  // =====================================================
  // BASE URL
  // =====================================================

  const BaseUrl = import.meta.env.VITE_BASE_URL;

  // =====================================================
  // STATES
  // =====================================================

  const [subCategoryData, setSubCategoryData] = useState([]);

  const [deleteIds, setDeleteIds] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [statusLoading, setStatusLoading] = useState(null);

  // =====================================================
  // GET SUB CATEGORY DATA
  // =====================================================

  const getSubCategoryData = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${BaseUrl}/subcategory/view`
      );

      if (response.data.status === 1) {
        setSubCategoryData(
          response.data.data || []
        );
      } else {
        setSubCategoryData([]);
      }
    } catch (error) {
      console.log(
        "Get Sub Category Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to fetch sub categories."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // PAGE LOAD
  // =====================================================

  useEffect(() => {
    getSubCategoryData();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredSubCategories = useMemo(() => {
    const searchValue = search
      .toLowerCase()
      .trim();

    if (!searchValue) {
      return subCategoryData;
    }

    return subCategoryData.filter((item) => {
      const subCategoryName =
        item.name?.toLowerCase() || "";

      const parentCategoryName =
        item.parentCategory?.name?.toLowerCase() ||
        "";

      return (
        subCategoryName.includes(
          searchValue
        ) ||
        parentCategoryName.includes(
          searchValue
        )
      );
    });
  }, [
    subCategoryData,
    search,
  ]);

  // =====================================================
  // UPDATE STATUS
  // =====================================================

  const updateSubCategoryStatus = async (
    id,
    status
  ) => {
    try {
      setStatusLoading(id);

      await axios.put(
        `${BaseUrl}/subcategory/update-status/${id}`,
        {
          status,
        }
      );

      getSubCategoryData();
    } catch (error) {
      console.log(
        "Update Sub Category Status Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to update status."
      );
    } finally {
      setStatusLoading(null);
    }
  };

  // =====================================================
  // SINGLE CHECKBOX
  // =====================================================

  const handleCheckbox = (e) => {
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
      const ids =
        filteredSubCategories.map(
          (item) => item._id
        );

      setDeleteIds(ids);
    } else {
      setDeleteIds([]);
    }
  };

  // =====================================================
  // DELETE SUB CATEGORIES
  // =====================================================

  const deleteSubCategory = async () => {
    if (deleteIds.length < 1) {
      alert(
        "Please select at least one sub category."
      );

      return;
    }

    const confirmDelete =
      window.confirm(
        `Are you sure you want to delete ${deleteIds.length} selected sub categor${
          deleteIds.length > 1
            ? "ies"
            : "y"
        }?`
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeleteLoading(true);

      const response =
        await axios.post(
          `${BaseUrl}/subcategory/delete`,
          {
            ids: deleteIds,
          }
        );

      if (response.data.status === 1) {
        alert(
          response.data.message ||
            "Sub categories deleted successfully."
        );

        setDeleteIds([]);

        getSubCategoryData();
      } else {
        alert(
          response.data.message ||
            "Unable to delete sub categories."
        );
      }
    } catch (error) {
      console.log(
        "Delete Sub Category Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Something went wrong while deleting."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // =====================================================
  // SELECT ALL CHECK
  // =====================================================

  const isAllSelected =
    filteredSubCategories.length > 0 &&
    filteredSubCategories.every(
      (item) =>
        deleteIds.includes(item._id)
    );

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
          Sub Categories
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          View and manage all product sub categories
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

            {/* SEARCH */}

            <div className="relative w-full xl:w-96">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search sub category..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-200 transition"
              />

            </div>

            {/* RIGHT ACTIONS */}

            <div className="flex flex-wrap items-center justify-between xl:justify-end gap-4">

              {/* TOTAL */}

              <div className="text-sm text-slate-500">

                Total:

                <span className="font-semibold text-slate-800 ml-1">
                  {subCategoryData.length}
                </span>

              </div>

              {/* SELECT ALL */}

              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer whitespace-nowrap">

                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  disabled={
                    filteredSubCategories.length ===
                    0
                  }
                  className="w-4 h-4 accent-slate-700 cursor-pointer"
                />

                Select All

              </label>

              {/* DELETE */}

              <button
                onClick={
                  deleteSubCategory
                }
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

          {/* SELECTED INFO */}

          {deleteIds.length > 0 && (
            <div className="mt-3 text-xs text-red-500">

              {deleteIds.length} sub categor
              {deleteIds.length > 1
                ? "ies"
                : "y"}{" "}
              selected

            </div>
          )}

        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="overflow-x-auto">

          {loading ? (

            // =================================================
            // LOADING
            // =================================================

            <div className="flex flex-col items-center justify-center py-16">

              <Loader2
                size={30}
                className="animate-spin text-slate-500"
              />

              <p className="text-sm text-slate-500 mt-3">
                Loading sub categories...
              </p>

            </div>

          ) : filteredSubCategories.length ===
            0 ? (

            // =================================================
            // EMPTY
            // =================================================

            <div className="flex flex-col items-center justify-center py-16 px-5">

              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">

                <Layers
                  size={26}
                  className="text-slate-400"
                />

              </div>

              <h3 className="text-base font-semibold text-slate-700 mt-4">
                No sub categories found
              </h3>

              <p className="text-sm text-slate-400 mt-1 text-center">

                {search
                  ? "Try searching with a different category name."
                  : "No sub categories are available."}

              </p>

            </div>

          ) : (

            // =================================================
            // TABLE DATA
            // =================================================

            <table className="w-full min-w-[850px]">

              {/* TABLE HEAD */}

              <thead className="bg-slate-50 border-b border-slate-100">

                <tr>

                  <th className="px-5 py-4 text-left">

                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={
                        handleSelectAll
                      }
                      className="w-4 h-4 accent-slate-700 cursor-pointer"
                    />

                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Image
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Parent Category
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Sub Category
                  </th>

                  <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>

                </tr>

              </thead>

              {/* TABLE BODY */}

              <tbody>

                {filteredSubCategories.map(
                  (item, index) => (

                    <tr
                      key={item._id}
                      className={`hover:bg-slate-50 transition ${
                        index !==
                        filteredSubCategories.length -
                          1
                          ? "border-b border-slate-100"
                          : ""
                      }`}
                    >

                      {/* CHECKBOX */}

                      <td className="px-5 py-4">

                        <input
                          type="checkbox"
                          value={item._id}
                          checked={deleteIds.includes(
                            item._id
                          )}
                          onChange={
                            handleCheckbox
                          }
                          className="w-4 h-4 accent-slate-700 cursor-pointer"
                        />

                      </td>

                      {/* IMAGE */}

                      <td className="px-5 py-4">

                        <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden border border-slate-100">

                          <img
                            src={item.image}
                            alt={
                              item.name ||
                              "Sub Category"
                            }
                            className="w-full h-full object-cover"
                          />

                        </div>

                      </td>

                      {/* PARENT CATEGORY */}

                      <td className="px-5 py-4">

                        <p className="font-medium text-sm text-slate-700">
                          {item.parentCategory
                            ?.name ||
                            "N/A"}
                        </p>

                      </td>

                      {/* SUB CATEGORY */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">

                            <Layers
                              size={17}
                              className="text-slate-500"
                            />

                          </div>

                          <p className="font-semibold text-sm text-slate-800">
                            {item.name}
                          </p>

                        </div>

                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">

                        <div className="flex justify-center">

                          {statusLoading ===
                          item._id ? (

                            <div className="flex items-center gap-2 text-sm text-slate-500">

                              <Loader2
                                size={16}
                                className="animate-spin"
                              />

                              Updating...

                            </div>

                          ) : (

                            <div className="flex items-center gap-2">

                              {item.active ? (

                                <CheckCircle
                                  size={15}
                                  className="text-green-500"
                                />

                              ) : (

                                <XCircle
                                  size={15}
                                  className="text-red-500"
                                />

                              )}

                              <select
                                value={
                                  item.active
                                    ? "true"
                                    : "false"
                                }
                                onChange={(e) =>
                                  updateSubCategoryStatus(
                                    item._id,
                                    e.target.value
                                  )
                                }
                                className={`rounded-lg border px-3 py-2 text-xs font-medium outline-none cursor-pointer ${
                                  item.active
                                    ? "border-green-200 bg-green-50 text-green-600"
                                    : "border-red-200 bg-red-50 text-red-600"
                                }`}
                              >

                                <option value="true">
                                  Active
                                </option>

                                <option value="false">
                                  Inactive
                                </option>

                              </select>

                            </div>

                          )}

                        </div>

                      </td>

                      {/* EDIT */}

                      <td className="px-5 py-4">

                        <div className="flex justify-center">

                          <Link
                            to={`/edit-subcategory/${item._id}`}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-sm px-4 py-2 rounded-lg transition"
                          >

                            <Pencil
                              size={15}
                            />

                            Edit

                          </Link>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </div>
  );
}