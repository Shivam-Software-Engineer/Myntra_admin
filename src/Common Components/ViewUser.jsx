import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    Search,
    Trash2,
    Eye,
    X,
    User,
    Mail,
    CalendarDays,
    CheckCircle,
    XCircle,
    Loader2,
} from "lucide-react";

export default function ViewUser() {

    // ==========================================
    // BASE URL
    // ==========================================

    const BaseUrl = import.meta.env.VITE_BASE_URL;


    // ==========================================
    // STATES
    // ==========================================

    const [users, setUsers] = useState([]);
    const [deleteIds, setDeleteIds] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);


    // ==========================================
    // GET USERS API
    // ==========================================

    const getUsers = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${BaseUrl}/user/view`
            );

            if (response.data.status === 1) {

                setUsers(response.data.users || []);

            } else {

                setUsers([]);

            }

        } catch (error) {

            console.log(
                "Get Users Error:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // GET USERS ON PAGE LOAD
    // ==========================================

    useEffect(() => {

        getUsers();

    }, []);


    // ==========================================
    // SEARCH USERS
    // ==========================================

    const filteredUsers = useMemo(() => {

        const searchValue = search
            .toLowerCase()
            .trim();

        if (!searchValue) {

            return users;

        }

        return users.filter((user) =>
            user.email
                ?.toLowerCase()
                .includes(searchValue)
        );

    }, [users, search]);


    // ==========================================
    // SELECT SINGLE USER
    // ==========================================

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


    // ==========================================
    // SELECT ALL USERS
    // ==========================================

    const selectAll = (e) => {

        if (e.target.checked) {

            setDeleteIds(
                filteredUsers.map(
                    (user) => user._id
                )
            );

        } else {

            setDeleteIds([]);

        }

    };


    // ==========================================
    // DELETE USERS API
    // ==========================================

    const deleteUsers = async () => {

        if (deleteIds.length === 0) {

            alert("Please select user first.");

            return;

        }


        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${deleteIds.length} selected user(s)?`
        );


        if (!confirmDelete) {

            return;

        }


        try {

            setDeleteLoading(true);


            const response = await axios.post(
                `${BaseUrl}/user/delete`,
                {
                    ids: deleteIds,
                }
            );


            if (response.data.status === 1) {

                alert(
                    response.data.message ||
                    "Users deleted successfully."
                );


                // Clear selected users

                setDeleteIds([]);


                // Refresh users

                getUsers();

            } else {

                alert(
                    response.data.message ||
                    "Unable to delete users."
                );

            }


        } catch (error) {

            console.log(
                "Delete Users Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Something went wrong while deleting users."
            );

        } finally {

            setDeleteLoading(false);

        }

    };


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {

        if (!date) {

            return "N/A";

        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    };


    // ==========================================
    // FORMAT DATE TIME
    // ==========================================

    const formatDateTime = (date) => {

        if (!date) {

            return "N/A";

        }

        return new Date(date).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );

    };


    // ==========================================
    // CHECK SELECT ALL
    // ==========================================

    const isAllSelected =
        filteredUsers.length > 0 &&
        filteredUsers.every((user) =>
            deleteIds.includes(user._id)
        );


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="min-h-screen bg-slate-100 p-4 sm:p-6">


            {/* ==========================================
                PAGE HEADER
            ========================================== */}

            <div className="mb-6">

                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">
                    Users
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                    View and manage all registered users
                </p>

            </div>



            {/* ==========================================
                TOP BAR
            ========================================== */}

            <div className="bg-white rounded-xl px-4 sm:px-5 py-4 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">


                {/* SEARCH */}

                <div className="relative w-full lg:w-96">

                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="text"
                        placeholder="Search users by email..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300"
                    />

                </div>



                {/* ACTIONS */}

                <div className="flex items-center justify-between sm:justify-end gap-4">


                    {/* TOTAL USERS */}

                    <div className="text-sm text-slate-500">

                        Total Users:

                        <span className="font-semibold text-slate-800 ml-1">
                            {users.length}
                        </span>

                    </div>



                    {/* SELECT ALL */}

                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer whitespace-nowrap">

                        <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={selectAll}
                            disabled={
                                filteredUsers.length === 0
                            }
                            className="w-4 h-4 accent-slate-700 cursor-pointer"
                        />

                        Select All

                    </label>



                    {/* DELETE */}

                    <button
                        onClick={deleteUsers}
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



            {/* ==========================================
                USER LIST
            ========================================== */}

            <div className="mt-6 bg-white rounded-xl overflow-hidden shadow-sm">


                {/* LOADING */}

                {loading && (

                    <div className="flex flex-col items-center justify-center py-16">

                        <Loader2
                            size={30}
                            className="animate-spin text-slate-500"
                        />

                        <p className="text-sm text-slate-500 mt-3">
                            Loading users...
                        </p>

                    </div>

                )}



                {/* EMPTY */}

                {!loading &&
                    filteredUsers.length === 0 && (

                        <div className="flex flex-col items-center justify-center py-16 px-5">

                            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">

                                <User
                                    size={25}
                                    className="text-slate-400"
                                />

                            </div>

                            <h3 className="text-base font-semibold text-slate-700 mt-4">
                                No users found
                            </h3>

                            <p className="text-sm text-slate-400 mt-1 text-center">
                                {search
                                    ? "Try searching with a different email."
                                    : "No registered users are available."
                                }
                            </p>

                        </div>

                    )}



                {/* USERS */}

                {!loading &&
                    filteredUsers.length > 0 && (

                        <div>

                            {filteredUsers.map(
                                (user, index) => (

                                    <div
                                        key={user._id}
                                        className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 hover:bg-slate-50 transition ${
                                            index !==
                                            filteredUsers.length - 1
                                                ? "border-b border-slate-100"
                                                : ""
                                        }`}
                                    >


                                        {/* CHECKBOX */}

                                        <input
                                            type="checkbox"
                                            value={user._id}
                                            checked={deleteIds.includes(
                                                user._id
                                            )}
                                            onChange={
                                                handleSelect
                                            }
                                            className="w-4 h-4 accent-slate-700 cursor-pointer flex-shrink-0"
                                        />



                                        {/* USER ICON */}

                                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">

                                            <User
                                                size={21}
                                                className="text-slate-500"
                                            />

                                        </div>



                                        {/* USER INFO */}

                                        <div className="flex-1 min-w-0">

                                            <h2 className="font-semibold text-slate-800 truncate">

                                                {user.email}

                                            </h2>

                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">

                                                <p className="text-xs text-slate-400 flex items-center gap-1">

                                                    <CalendarDays
                                                        size={13}
                                                    />

                                                    Joined{" "}
                                                    {formatDate(
                                                        user.createdAt
                                                    )}

                                                </p>

                                                <p className="text-xs text-slate-400">

                                                    ID:{" "}
                                                    {user._id.slice(
                                                        -8
                                                    )}

                                                </p>

                                            </div>

                                        </div>



                                        {/* ACTIVE STATUS */}

                                        <div className="hidden sm:block">

                                            {user.active ? (

                                                <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-green-50 text-green-600">

                                                    <CheckCircle
                                                        size={14}
                                                    />

                                                    Active

                                                </span>

                                            ) : (

                                                <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-600">

                                                    <XCircle
                                                        size={14}
                                                    />

                                                    Inactive

                                                </span>

                                            )}

                                        </div>



                                        {/* VIEW */}

                                        <button
                                            onClick={() =>
                                                setSelectedUser(
                                                    user
                                                )
                                            }
                                            className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600 transition flex-shrink-0"
                                        >

                                            <Eye size={17} />

                                            <span className="hidden sm:inline">
                                                View
                                            </span>

                                        </button>

                                    </div>

                                )
                            )}

                        </div>

                    )}

            </div>



            {/* ==========================================
                USER DETAILS DRAWER
            ========================================== */}

            {selectedUser && (

                <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]">


                    {/* CLOSE ON OUTSIDE CLICK */}

                    <div
                        className="absolute inset-0"
                        onClick={() =>
                            setSelectedUser(null)
                        }
                    />



                    {/* DRAWER */}

                    <div className="absolute right-0 top-0 h-full w-full sm:w-[430px] bg-white shadow-2xl overflow-y-auto">


                        {/* DRAWER HEADER */}

                        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-4 border-b">

                            <div>

                                <h2 className="text-lg font-semibold text-slate-800">
                                    User Details
                                </h2>

                                <p className="text-xs text-slate-400 mt-0.5">
                                    User account information
                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    setSelectedUser(null)
                                }
                                className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center transition"
                            >

                                <X size={18} />

                            </button>

                        </div>



                        {/* DRAWER BODY */}

                        <div className="p-5">


                            {/* USER PROFILE */}

                            <div className="flex flex-col items-center py-5">

                                <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center">

                                    <User
                                        size={42}
                                        className="text-slate-500"
                                    />

                                </div>

                                <h2 className="text-xl font-semibold text-slate-800 mt-4 break-all text-center">

                                    {selectedUser.email}

                                </h2>


                                {/* STATUS */}

                                <div className="mt-3">

                                    {selectedUser.active ? (

                                        <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-green-50 text-green-600">

                                            <CheckCircle
                                                size={14}
                                            />

                                            Active Account

                                        </span>

                                    ) : (

                                        <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-600">

                                            <XCircle
                                                size={14}
                                            />

                                            Inactive Account

                                        </span>

                                    )}

                                </div>

                            </div>



                            {/* INFORMATION */}

                            <div className="mt-5 border border-slate-100 rounded-xl overflow-hidden">


                                {/* EMAIL */}

                                <div className="flex items-start gap-3 px-4 py-4 border-b border-slate-100">

                                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">

                                        <Mail
                                            size={17}
                                            className="text-slate-500"
                                        />

                                    </div>

                                    <div className="min-w-0">

                                        <p className="text-xs text-slate-400">
                                            Email Address
                                        </p>

                                        <p className="text-sm font-medium text-slate-700 break-all mt-1">
                                            {selectedUser.email}
                                        </p>

                                    </div>

                                </div>



                                {/* USER ID */}

                                <div className="px-4 py-4 border-b border-slate-100">

                                    <p className="text-xs text-slate-400">
                                        User ID
                                    </p>

                                    <p className="text-sm font-medium text-slate-700 break-all mt-1">
                                        {selectedUser._id}
                                    </p>

                                </div>



                                {/* CREATED DATE */}

                                <div className="px-4 py-4 border-b border-slate-100">

                                    <p className="text-xs text-slate-400">
                                        Account Created
                                    </p>

                                    <p className="text-sm font-medium text-slate-700 mt-1">
                                        {formatDateTime(
                                            selectedUser.createdAt
                                        )}
                                    </p>

                                </div>



                                {/* UPDATED DATE */}

                                <div className="px-4 py-4">

                                    <p className="text-xs text-slate-400">
                                        Last Updated
                                    </p>

                                    <p className="text-sm font-medium text-slate-700 mt-1">
                                        {formatDateTime(
                                            selectedUser.updatedAt
                                        )}
                                    </p>

                                </div>

                            </div>



                            {/* SECURITY NOTE */}

                            <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-100">

                                <p className="text-xs text-slate-500 leading-5">

                                    Password and other sensitive account
                                    information are not displayed in the
                                    admin panel.

                                </p>

                            </div>



                            {/* DELETE SINGLE USER */}

                            <button
                                onClick={async () => {

                                    const confirmDelete =
                                        window.confirm(
                                            "Are you sure you want to delete this user?"
                                        );

                                    if (!confirmDelete) {
                                        return;
                                    }

                                    try {

                                        setDeleteLoading(true);

                                        const response =
                                            await axios.post(
                                                `${BaseUrl}/admin/user/delete`,
                                                {
                                                    ids: [
                                                        selectedUser._id,
                                                    ],
                                                }
                                            );

                                        if (
                                            response.data.status ===
                                            1
                                        ) {

                                            alert(
                                                response.data.message ||
                                                "User deleted successfully."
                                            );

                                            setSelectedUser(
                                                null
                                            );

                                            setDeleteIds(
                                                (prev) =>
                                                    prev.filter(
                                                        (id) =>
                                                            id !==
                                                            selectedUser._id
                                                    )
                                            );

                                            getUsers();

                                        } else {

                                            alert(
                                                response.data.message ||
                                                "Unable to delete user."
                                            );

                                        }

                                    } catch (error) {

                                        console.log(
                                            "Delete User Error:",
                                            error
                                        );

                                        alert(
                                            error.response?.data
                                                ?.message ||
                                            "Something went wrong."
                                        );

                                    } finally {

                                        setDeleteLoading(
                                            false
                                        );

                                    }

                                }}
                                disabled={deleteLoading}
                                className="w-full mt-5 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-3 rounded-lg text-sm font-medium transition"
                            >

                                {deleteLoading ? (

                                    <Loader2
                                        size={17}
                                        className="animate-spin"
                                    />

                                ) : (

                                    <Trash2 size={17} />

                                )}

                                Delete User

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}