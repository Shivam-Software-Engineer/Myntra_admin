import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
    Search,
    Trash2,
    Eye,
    X,
    ShoppingBag,
    User,
    MapPin,
    CreditCard,
    Package,
    CalendarDays,
    CheckCircle,
    Clock,
    XCircle,
    Loader2,
    Truck,
    Phone,
    Mail,
    Hash,
} from "lucide-react";


export default function ViewOrders() {

    // =====================================================
    // BASE URL
    // =====================================================

    const BaseUrl = import.meta.env.VITE_BASE_URL;


    // =====================================================
    // STATES
    // =====================================================

    const [orders, setOrders] = useState([]);

    const [deleteIds, setDeleteIds] = useState([]);

    const [selectedOrder, setSelectedOrder] = useState(null);

    const [search, setSearch] = useState("");

    const [paymentFilter, setPaymentFilter] = useState("ALL");

    const [statusFilter, setStatusFilter] = useState("ALL");

    const [loading, setLoading] = useState(false);

    const [deleteLoading, setDeleteLoading] = useState(false);


    // =====================================================
    // GET ALL ORDERS
    // =====================================================

    const getOrders = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${BaseUrl}/order/view`
            );


            if (response.data.status === 1) {

                // API response me array "users" ke naam se aa raha hai

                setOrders(
                    response.data.users || []
                );

            } else {

                setOrders([]);

            }

        } catch (error) {

            console.log(
                "Get Orders Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to fetch orders."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // PAGE LOAD
    // =====================================================

    useEffect(() => {

        getOrders();

    }, []);


    // =====================================================
    // SEARCH + FILTER
    // =====================================================

    const filteredOrders = useMemo(() => {

        return orders.filter((order) => {

            const searchValue =
                search
                    .toLowerCase()
                    .trim();


            const orderId =
                order._id
                    ?.toLowerCase() || "";


            const email =
                order.user?.email
                    ?.toLowerCase() || "";


            const fullName =
                order.shippingAddress?.fullName
                    ?.toLowerCase() || "";


            const mobile =
                order.shippingAddress?.mobile
                    ?.toLowerCase() || "";


            const razorpayOrderId =
                order.razorpayOrderId
                    ?.toLowerCase() || "";


            const productNames =
                order.items
                    ?.map(
                        (item) =>
                            item.productName
                    )
                    .join(" ")
                    .toLowerCase() || "";


            const matchesSearch =

                !searchValue ||

                orderId.includes(
                    searchValue
                ) ||

                email.includes(
                    searchValue
                ) ||

                fullName.includes(
                    searchValue
                ) ||

                mobile.includes(
                    searchValue
                ) ||

                razorpayOrderId.includes(
                    searchValue
                ) ||

                productNames.includes(
                    searchValue
                );


            const matchesPayment =

                paymentFilter === "ALL" ||

                order.paymentStatus ===
                    paymentFilter;


            const matchesStatus =

                statusFilter === "ALL" ||

                order.orderStatus ===
                    statusFilter;


            return (
                matchesSearch &&
                matchesPayment &&
                matchesStatus
            );

        });

    }, [
        orders,
        search,
        paymentFilter,
        statusFilter,
    ]);


    // =====================================================
    // SELECT SINGLE ORDER
    // =====================================================

    const handleSelect = (e) => {

        const id = e.target.value;


        if (e.target.checked) {

            setDeleteIds(
                (prev) => [
                    ...prev,
                    id,
                ]
            );

        } else {

            setDeleteIds(
                (prev) =>
                    prev.filter(
                        (item) =>
                            item !== id
                    )
            );

        }

    };


    // =====================================================
    // SELECT ALL
    // =====================================================

    const selectAll = (e) => {

        if (e.target.checked) {

            setDeleteIds(
                filteredOrders.map(
                    (order) =>
                        order._id
                )
            );

        } else {

            setDeleteIds([]);

        }

    };


    // =====================================================
    // DELETE ORDERS
    // =====================================================

    const deleteOrders = async () => {

        if (deleteIds.length === 0) {

            alert(
                "Please select order first."
            );

            return;

        }


        const confirmDelete =
            window.confirm(
                `Are you sure you want to delete ${deleteIds.length} selected order(s)?`
            );


        if (!confirmDelete) {

            return;

        }


        try {

            setDeleteLoading(true);


            const response =
                await axios.post(
                    `${BaseUrl}/order/delete`,
                    {
                        ids: deleteIds,
                    }
                );


            if (
                response.data.status === 1
            ) {

                alert(
                    response.data.message ||
                    "Orders deleted successfully."
                );


                setDeleteIds([]);


                getOrders();

            } else {

                alert(
                    response.data.message ||
                    "Unable to delete orders."
                );

            }

        } catch (error) {

            console.log(
                "Delete Orders Error:",
                error
            );


            alert(
                error.response?.data
                    ?.message ||
                "Something went wrong while deleting orders."
            );

        } finally {

            setDeleteLoading(false);

        }

    };


    // =====================================================
    // DELETE SINGLE ORDER
    // =====================================================

    const deleteSingleOrder = async () => {

        if (!selectedOrder) {

            return;

        }


        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this order?"
            );


        if (!confirmDelete) {

            return;

        }


        try {

            setDeleteLoading(true);


            const response =
                await axios.post(
                    `${BaseUrl}/admin/order/delete`,
                    {
                        ids: [
                            selectedOrder._id,
                        ],
                    }
                );


            if (
                response.data.status === 1
            ) {

                alert(
                    response.data.message ||
                    "Order deleted successfully."
                );


                setDeleteIds(
                    (prev) =>
                        prev.filter(
                            (id) =>
                                id !==
                                selectedOrder._id
                        )
                );


                setSelectedOrder(null);


                getOrders();

            } else {

                alert(
                    response.data.message ||
                    "Unable to delete order."
                );

            }

        } catch (error) {

            console.log(
                "Delete Single Order Error:",
                error
            );


            alert(
                error.response?.data
                    ?.message ||
                "Something went wrong."
            );

        } finally {

            setDeleteLoading(false);

        }

    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {

            return "N/A";

        }


        return new Date(
            date
        ).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    };


    // =====================================================
    // FORMAT DATE TIME
    // =====================================================

    const formatDateTime = (date) => {

        if (!date) {

            return "N/A";

        }


        return new Date(
            date
        ).toLocaleString(
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


    // =====================================================
    // CURRENCY FORMAT
    // =====================================================

    const formatPrice = (price) => {

        return Number(
            price || 0
        ).toLocaleString(
            "en-IN"
        );

    };


    // =====================================================
    // SELECT ALL CHECK
    // =====================================================

    const isAllSelected =

        filteredOrders.length > 0 &&

        filteredOrders.every(
            (order) =>
                deleteIds.includes(
                    order._id
                )
        );


    // =====================================================
    // ORDER STATUS BADGE
    // =====================================================

    const getOrderStatus = (
        status
    ) => {

        const value =
            status?.toUpperCase();


        if (
            value ===
            "COMPLETED"
        ) {

            return (
                <span className="flex items-center gap-1.5 w-fit text-xs px-3 py-1.5 rounded-full bg-green-50 text-green-600">

                    <CheckCircle
                        size={14}
                    />

                    Completed

                </span>
            );

        }


        if (
            value ===
            "CANCELLED"
        ) {

            return (
                <span className="flex items-center gap-1.5 w-fit text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-600">

                    <XCircle
                        size={14}
                    />

                    Cancelled

                </span>
            );

        }


        if (
            value ===
            "DELIVERED"
        ) {

            return (
                <span className="flex items-center gap-1.5 w-fit text-xs px-3 py-1.5 rounded-full bg-green-50 text-green-600">

                    <CheckCircle
                        size={14}
                    />

                    Delivered

                </span>
            );

        }


        if (
            value ===
            "SHIPPED"
        ) {

            return (
                <span className="flex items-center gap-1.5 w-fit text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-600">

                    <Truck
                        size={14}
                    />

                    Shipped

                </span>
            );

        }


        return (
            <span className="flex items-center gap-1.5 w-fit text-xs px-3 py-1.5 rounded-full bg-orange-50 text-orange-600">

                <Clock
                    size={14}
                />

                {status || "Processing"}

            </span>
        );

    };


    // =====================================================
    // PAYMENT STATUS BADGE
    // =====================================================

    const getPaymentStatus = (
        status
    ) => {

        const value =
            status?.toUpperCase();


        if (
            value ===
            "COMPLETED"
        ) {

            return (
                <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-600 font-medium">

                    Paid

                </span>
            );

        }


        if (
            value ===
            "FAILED"
        ) {

            return (
                <span className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-600 font-medium">

                    Failed

                </span>
            );

        }


        return (
            <span className="text-xs px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 font-medium">

                {status || "Pending"}

            </span>
        );

    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="min-h-screen bg-slate-100 p-4 sm:p-6">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-6">

                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">

                    Orders

                </h1>


                <p className="text-sm text-slate-500 mt-1">

                    View and manage all customer orders

                </p>

            </div>



            {/* =================================================
                FILTER BAR
            ================================================= */}

            <div className="bg-white rounded-xl px-4 sm:px-5 py-4 shadow-sm">


                <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">


                    {/* SEARCH */}

                    <div className="relative w-full xl:w-96">

                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            placeholder="Search order, email, customer..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                        />

                    </div>



                    {/* FILTERS */}

                    <div className="flex flex-col sm:flex-row gap-3">


                        {/* PAYMENT FILTER */}

                        <select
                            value={
                                paymentFilter
                            }
                            onChange={(e) =>
                                setPaymentFilter(
                                    e.target.value
                                )
                            }
                            className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2.5 text-sm text-slate-600 outline-none cursor-pointer"
                        >

                            <option value="ALL">
                                All Payments
                            </option>

                            <option value="COMPLETED">
                                Paid
                            </option>

                            <option value="PENDING">
                                Pending
                            </option>

                            <option value="FAILED">
                                Failed
                            </option>

                        </select>



                        {/* ORDER STATUS */}

                        <select
                            value={
                                statusFilter
                            }
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value
                                )
                            }
                            className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2.5 text-sm text-slate-600 outline-none cursor-pointer"
                        >

                            <option value="ALL">
                                All Orders
                            </option>

                            <option value="PROCESSING">
                                Processing
                            </option>

                            <option value="SHIPPED">
                                Shipped
                            </option>

                            <option value="DELIVERED">
                                Delivered
                            </option>

                            <option value="COMPLETED">
                                Completed
                            </option>

                            <option value="CANCELLED">
                                Cancelled
                            </option>

                        </select>

                    </div>

                </div>



                {/* ACTIONS */}

                <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-100">


                    <div className="flex items-center gap-4 text-sm text-slate-500">

                        <span>

                            Total Orders:

                            <strong className="text-slate-800 ml-1">

                                {orders.length}

                            </strong>

                        </span>


                        {deleteIds.length > 0 && (

                            <span className="text-red-500">

                                {deleteIds.length}
                                {" "}
                                Selected

                            </span>

                        )}

                    </div>



                    <div className="flex items-center gap-4">


                        {/* SELECT ALL */}

                        <label className="flex items-center gap-2 text-sm cursor-pointer">

                            <input
                                type="checkbox"
                                checked={
                                    isAllSelected
                                }
                                onChange={
                                    selectAll
                                }
                                disabled={
                                    filteredOrders.length ===
                                    0
                                }
                                className="w-4 h-4 accent-slate-700"
                            />

                            Select All

                        </label>



                        {/* DELETE */}

                        <button
                            onClick={
                                deleteOrders
                            }
                            disabled={
                                deleteIds.length ===
                                    0 ||
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

                                <Trash2
                                    size={16}
                                />

                            )}

                            Delete

                        </button>

                    </div>

                </div>

            </div>



            {/* =================================================
                ORDERS LIST
            ================================================= */}

            <div className="mt-6 bg-white rounded-xl overflow-hidden shadow-sm">


                {/* LOADING */}

                {loading && (

                    <div className="flex flex-col items-center justify-center py-16">

                        <Loader2
                            size={30}
                            className="animate-spin text-slate-500"
                        />

                        <p className="text-sm text-slate-500 mt-3">

                            Loading orders...

                        </p>

                    </div>

                )}



                {/* EMPTY */}

                {!loading &&
                    filteredOrders.length ===
                        0 && (

                        <div className="flex flex-col items-center justify-center py-16 px-5">

                            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">

                                <ShoppingBag
                                    size={25}
                                    className="text-slate-400"
                                />

                            </div>


                            <h3 className="text-base font-semibold text-slate-700 mt-4">

                                No orders found

                            </h3>


                            <p className="text-sm text-slate-400 mt-1">

                                Try changing your search or filters.

                            </p>

                        </div>

                    )}



                {/* ORDER ITEMS */}

                {!loading &&
                    filteredOrders.length >
                        0 && (

                        <div>

                            {filteredOrders.map(
                                (
                                    order,
                                    index
                                ) => (

                                    <div
                                        key={
                                            order._id
                                        }
                                        className={`p-4 sm:p-5 hover:bg-slate-50 transition ${
                                            index !==
                                            filteredOrders.length -
                                                1
                                                ? "border-b border-slate-100"
                                                : ""
                                        }`}
                                    >


                                        {/* TOP */}

                                        <div className="flex items-start gap-3">


                                            {/* CHECKBOX */}

                                            <input
                                                type="checkbox"
                                                value={
                                                    order._id
                                                }
                                                checked={deleteIds.includes(
                                                    order._id
                                                )}
                                                onChange={
                                                    handleSelect
                                                }
                                                className="w-4 h-4 mt-1 accent-slate-700 flex-shrink-0"
                                            />



                                            {/* PRODUCT IMAGE */}

                                            <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">

                                                <img
                                                    src={
                                                        order.items?.[0]
                                                            ?.productImage
                                                    }
                                                    alt={
                                                        order.items?.[0]
                                                            ?.productName ||
                                                        "Product"
                                                    }
                                                    className="w-full h-full object-cover"
                                                />

                                            </div>



                                            {/* ORDER INFO */}

                                            <div className="flex-1 min-w-0">


                                                <div className="flex flex-wrap items-center gap-2">

                                                    <h2 className="font-semibold text-slate-800">

                                                        Order #
                                                        {order._id.slice(
                                                            -8
                                                        )}

                                                    </h2>


                                                    {getOrderStatus(
                                                        order.orderStatus
                                                    )}

                                                </div>


                                                <p className="text-sm text-slate-500 mt-1 truncate">

                                                    {order.shippingAddress
                                                        ?.fullName ||
                                                        "Customer"}

                                                    {" • "}

                                                    {order.user
                                                        ?.email ||
                                                        "No email"}

                                                </p>


                                                <p className="text-xs text-slate-400 mt-1">

                                                    {formatDateTime(
                                                        order.createdAt
                                                    )}

                                                </p>

                                            </div>



                                            {/* AMOUNT */}

                                            <div className="hidden sm:block text-right">

                                                <p className="font-bold text-slate-800">

                                                    ₹
                                                    {formatPrice(
                                                        order.orderAmount
                                                    )}

                                                </p>


                                                <p className="text-xs text-slate-400 mt-1">

                                                    {order.quantity}
                                                    {" "}
                                                    Item
                                                    {order.quantity >
                                                    1
                                                        ? "s"
                                                        : ""}

                                                </p>

                                            </div>



                                            {/* VIEW */}

                                            <button
                                                onClick={() =>
                                                    setSelectedOrder(
                                                        order
                                                    )
                                                }
                                                className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600 transition flex-shrink-0"
                                            >

                                                <Eye
                                                    size={17}
                                                />

                                                <span className="hidden sm:inline">

                                                    View

                                                </span>

                                            </button>

                                        </div>



                                        {/* BOTTOM INFO */}

                                        <div className="ml-7 sm:ml-[76px] mt-4 flex flex-wrap items-center gap-3 sm:gap-6">


                                            {/* PAYMENT */}

                                            <div className="flex items-center gap-2">

                                                <CreditCard
                                                    size={15}
                                                    className="text-slate-400"
                                                />

                                                <span className="text-xs text-slate-500">

                                                    {order.paymentMethod}

                                                </span>

                                                {getPaymentStatus(
                                                    order.paymentStatus
                                                )}

                                            </div>



                                            {/* ITEMS */}

                                            <div className="flex items-center gap-2 text-xs text-slate-500">

                                                <Package
                                                    size={15}
                                                    className="text-slate-400"
                                                />

                                                {order.items?.length ||
                                                    0}
                                                {" "}
                                                Product
                                                {order.items?.length >
                                                1
                                                    ? "s"
                                                    : ""}

                                            </div>



                                            {/* SHIPPING */}

                                            <div className="flex items-center gap-2 text-xs text-slate-500">

                                                <Truck
                                                    size={15}
                                                    className="text-slate-400"
                                                />

                                                Shipping ₹
                                                {formatPrice(
                                                    order.shippingCharges
                                                )}

                                            </div>


                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

            </div>



            {/* =================================================
                ORDER DETAILS DRAWER
            ================================================= */}

            {selectedOrder && (

                <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]">


                    {/* OUTSIDE CLICK */}

                    <div
                        className="absolute inset-0"
                        onClick={() =>
                            setSelectedOrder(
                                null
                            )
                        }
                    />


                    {/* DRAWER */}

                    <div className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white shadow-2xl overflow-y-auto">


                        {/* DRAWER HEADER */}

                        <div className="sticky top-0 z-20 bg-white flex items-center justify-between px-5 py-4 border-b">

                            <div>

                                <h2 className="text-lg font-semibold text-slate-800">

                                    Order Details

                                </h2>

                                <p className="text-xs text-slate-400 mt-1">

                                    #
                                    {selectedOrder._id}

                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    setSelectedOrder(
                                        null
                                    )
                                }
                                className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"
                            >

                                <X
                                    size={18}
                                />

                            </button>

                        </div>



                        {/* DRAWER BODY */}

                        <div className="p-5">


                            {/* ORDER STATUS */}

                            <div className="flex flex-wrap items-center justify-between gap-3">

                                <div>

                                    <p className="text-xs text-slate-400">

                                        Order Date

                                    </p>

                                    <p className="text-sm font-medium text-slate-700 mt-1">

                                        {formatDateTime(
                                            selectedOrder.createdAt
                                        )}

                                    </p>

                                </div>


                                {getOrderStatus(
                                    selectedOrder.orderStatus
                                )}

                            </div>



                            {/* CUSTOMER */}

                            <div className="mt-6">

                                <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">

                                    <User
                                        size={17}
                                    />

                                    Customer Details

                                </h3>


                                <div className="border border-slate-100 rounded-xl p-4 space-y-3">


                                    <div className="flex items-center gap-3">

                                        <Mail
                                            size={16}
                                            className="text-slate-400"
                                        />

                                        <div>

                                            <p className="text-xs text-slate-400">

                                                Email

                                            </p>

                                            <p className="text-sm text-slate-700 break-all">

                                                {selectedOrder
                                                    .user
                                                    ?.email ||
                                                    "N/A"}

                                            </p>

                                        </div>

                                    </div>


                                    <div className="flex items-center gap-3">

                                        <Phone
                                            size={16}
                                            className="text-slate-400"
                                        />

                                        <div>

                                            <p className="text-xs text-slate-400">

                                                Mobile

                                            </p>

                                            <p className="text-sm text-slate-700">

                                                {selectedOrder
                                                    .shippingAddress
                                                    ?.mobile ||
                                                    "N/A"}

                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>



                            {/* PRODUCTS */}

                            <div className="mt-6">

                                <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">

                                    <Package
                                        size={17}
                                    />

                                    Order Items

                                </h3>


                                <div className="border border-slate-100 rounded-xl overflow-hidden">

                                    {selectedOrder.items?.map(
                                        (
                                            item
                                        ) => (

                                            <div
                                                key={
                                                    item._id
                                                }
                                                className="flex gap-3 p-4 border-b border-slate-100 last:border-b-0"
                                            >

                                                <img
                                                    src={
                                                        item.productImage
                                                    }
                                                    alt={
                                                        item.productName
                                                    }
                                                    className="w-16 h-16 rounded-lg object-cover bg-slate-100"
                                                />


                                                <div className="flex-1 min-w-0">

                                                    <h4 className="font-medium text-sm text-slate-800">

                                                        {
                                                            item.productName
                                                        }

                                                    </h4>


                                                    <p className="text-xs text-slate-500 mt-1">

                                                        {
                                                            item.brand
                                                        }

                                                    </p>


                                                    <div className="flex flex-wrap gap-2 mt-2">

                                                        {item.size && (

                                                            <span className="text-xs bg-slate-100 px-2 py-1 rounded">

                                                                Size:
                                                                {" "}
                                                                {
                                                                    item.size
                                                                }

                                                            </span>

                                                        )}


                                                        {item.color && (

                                                            <span className="text-xs bg-slate-100 px-2 py-1 rounded">

                                                                Color:
                                                                {" "}
                                                                {
                                                                    item.color
                                                                }

                                                            </span>

                                                        )}


                                                        <span className="text-xs bg-slate-100 px-2 py-1 rounded">

                                                            Qty:
                                                            {" "}
                                                            {
                                                                item.quantity
                                                            }

                                                        </span>

                                                    </div>

                                                </div>


                                                <div className="text-right">

                                                    <p className="font-semibold text-sm text-slate-800">

                                                        ₹
                                                        {formatPrice(
                                                            item.sellingPrice
                                                        )}

                                                    </p>


                                                    <p className="text-xs text-slate-400 line-through mt-1">

                                                        ₹
                                                        {formatPrice(
                                                            item.mrpPrice
                                                        )}

                                                    </p>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>



                            {/* SHIPPING ADDRESS */}

                            <div className="mt-6">

                                <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">

                                    <MapPin
                                        size={17}
                                    />

                                    Shipping Address

                                </h3>


                                <div className="border border-slate-100 rounded-xl p-4 bg-slate-50">


                                    <p className="font-medium text-slate-800">

                                        {
                                            selectedOrder
                                                .shippingAddress
                                                ?.fullName
                                        }

                                    </p>


                                    <p className="text-sm text-slate-600 mt-2 leading-6">

                                        {
                                            selectedOrder
                                                .shippingAddress
                                                ?.address
                                        }

                                        <br />

                                        {
                                            selectedOrder
                                                .shippingAddress
                                                ?.city
                                        }
                                        ,{" "}

                                        {
                                            selectedOrder
                                                .shippingAddress
                                                ?.state
                                        }

                                        <br />

                                        Pincode:{" "}

                                        {
                                            selectedOrder
                                                .shippingAddress
                                                ?.pincode
                                        }

                                    </p>


                                    <p className="text-sm text-slate-600 mt-2">

                                        Mobile:{" "}

                                        {
                                            selectedOrder
                                                .shippingAddress
                                                ?.mobile
                                        }

                                    </p>


                                    <span className="inline-block mt-3 text-xs bg-white border border-slate-200 px-2.5 py-1 rounded-full text-slate-600">

                                        {
                                            selectedOrder
                                                .shippingAddress
                                                ?.addressType ||
                                            "Address"
                                        }

                                    </span>

                                </div>

                            </div>



                            {/* PAYMENT */}

                            <div className="mt-6">

                                <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">

                                    <CreditCard
                                        size={17}
                                    />

                                    Payment Details

                                </h3>


                                <div className="border border-slate-100 rounded-xl overflow-hidden">


                                    <div className="flex justify-between px-4 py-3 border-b border-slate-100">

                                        <span className="text-sm text-slate-500">

                                            Payment Method

                                        </span>

                                        <span className="text-sm font-medium text-slate-700">

                                            {
                                                selectedOrder
                                                    .paymentMethod
                                            }

                                        </span>

                                    </div>


                                    <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100">

                                        <span className="text-sm text-slate-500">

                                            Payment Status

                                        </span>

                                        {
                                            getPaymentStatus(
                                                selectedOrder.paymentStatus
                                            )
                                        }

                                    </div>


                                    <div className="flex justify-between px-4 py-3 border-b border-slate-100 gap-4">

                                        <span className="text-sm text-slate-500">

                                            Razorpay Order ID

                                        </span>

                                        <span className="text-xs font-medium text-slate-700 break-all text-right">

                                            {
                                                selectedOrder
                                                    .razorpayOrderId ||
                                                "N/A"
                                            }

                                        </span>

                                    </div>


                                    <div className="flex justify-between px-4 py-3 gap-4">

                                        <span className="text-sm text-slate-500">

                                            Payment ID

                                        </span>

                                        <span className="text-xs font-medium text-slate-700 break-all text-right">

                                            {
                                                selectedOrder
                                                    .razorpayPaymentId ||
                                                "N/A"
                                            }

                                        </span>

                                    </div>

                                </div>

                            </div>



                            {/* ORDER SUMMARY */}

                            <div className="mt-6">

                                <h3 className="font-semibold text-slate-700 mb-3">

                                    Order Summary

                                </h3>


                                <div className="border border-slate-100 rounded-xl p-4 space-y-3">


                                    <div className="flex justify-between text-sm">

                                        <span className="text-slate-500">

                                            Total Items

                                        </span>

                                        <span className="font-medium text-slate-700">

                                            {
                                                selectedOrder
                                                    .quantity
                                            }

                                        </span>

                                    </div>


                                    <div className="flex justify-between text-sm">

                                        <span className="text-slate-500">

                                            Shipping Charges

                                        </span>

                                        <span className="font-medium text-slate-700">

                                            ₹
                                            {formatPrice(
                                                selectedOrder
                                                    .shippingCharges
                                            )}

                                        </span>

                                    </div>


                                    <div className="pt-3 border-t border-slate-100 flex justify-between">

                                        <span className="font-semibold text-slate-800">

                                            Order Total

                                        </span>

                                        <span className="font-bold text-lg text-slate-800">

                                            ₹
                                            {formatPrice(
                                                selectedOrder
                                                    .orderAmount
                                            )}

                                        </span>

                                    </div>

                                </div>

                            </div>



                            {/* ORDER ID */}

                            <div className="mt-6 p-4 bg-slate-50 rounded-xl">

                                <div className="flex items-start gap-3">

                                    <Hash
                                        size={17}
                                        className="text-slate-400 mt-0.5"
                                    />

                                    <div className="min-w-0">

                                        <p className="text-xs text-slate-400">

                                            Order ID

                                        </p>

                                        <p className="text-xs text-slate-600 break-all mt-1">

                                            {
                                                selectedOrder._id
                                            }

                                        </p>

                                    </div>

                                </div>

                            </div>



                            {/* DELETE */}

                            <button
                                onClick={
                                    deleteSingleOrder
                                }
                                disabled={
                                    deleteLoading
                                }
                                className="w-full mt-5 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-3 rounded-lg text-sm font-medium transition"
                            >

                                {deleteLoading ? (

                                    <Loader2
                                        size={17}
                                        className="animate-spin"
                                    />

                                ) : (

                                    <Trash2
                                        size={17}
                                    />

                                )}

                                Delete Order

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}