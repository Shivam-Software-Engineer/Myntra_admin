import React, { useEffect, useState } from "react";

import axios from "axios";

import {
    FiShoppingCart,
    FiUsers,
    FiDollarSign,
    FiClock,
    FiTruck,
    FiCheckCircle,
    FiRefreshCw,
} from "react-icons/fi";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";


export default function Dashboard() {


    // =====================================================
    // BASE URL
    // =====================================================

    const BaseUrl =
        import.meta.env.VITE_BASE_URL;


    // =====================================================
    // STATES
    // =====================================================

    const [dashboardData, setDashboardData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    // =====================================================
    // GET DASHBOARD DATA
    // =====================================================

    const getDashboardData =
        async () => {

            try {

                setLoading(true);


                const response =
                    await axios.get(
                        `${BaseUrl}/dashboard/overview`
                    );


                if (
                    response.data.status === 1
                ) {

                    setDashboardData(
                        response.data.data
                    );

                }

            } catch (error) {

                console.log(
                    "Dashboard Error:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };


    // =====================================================
    // PAGE LOAD
    // =====================================================

    useEffect(() => {

        getDashboardData();

    }, []);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-100 flex items-center justify-center">

                <div className="flex flex-col items-center gap-3">

                    <FiRefreshCw
                        size={32}
                        className="animate-spin text-slate-600"
                    />

                    <p className="text-slate-500">

                        Loading Dashboard...

                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // SAFE DATA
    // =====================================================

    const sales =
        dashboardData?.sales || {};

    const orders =
        dashboardData?.orders || {};

    const users =
        dashboardData?.users || {};

    const chart =
        dashboardData?.chart || [];


    // =====================================================
    // FORMAT MONEY
    // =====================================================

    const formatMoney = (amount = 0) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(amount);
};


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate =
        (date) => {

            return new Date(
                date
            ).toLocaleDateString(
                "en-US",
                {
                    weekday: "short"
                }
            );

        };


    // =====================================================
    // CHART DATA
    // =====================================================

    const formattedChart =
        chart.map((item) => ({

            ...item,

            day:
                formatDate(
                    item.date
                )

        }));


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="min-h-screen bg-slate-100 p-4 sm:p-6">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

                <div>

                    <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">

                        Dashboard

                    </h1>

                    <p className="text-sm text-slate-500 mt-1">

                        Overview of your store performance

                    </p>

                </div>


                <button
                    onClick={
                        getDashboardData
                    }
                    className="w-fit flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-lg text-sm transition"
                >

                    <FiRefreshCw
                        size={16}
                    />

                    Refresh

                </button>

            </div>


            {/* =================================================
                MAIN STATS
            ================================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">


                {/* TODAY SALES */}

                <div className="bg-white rounded-xl p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">

                                Today's Sales

                            </p>

                            <h2 className="text-2xl font-bold text-slate-800 mt-2">

                                {formatMoney(
                                    sales.today
                                )}

                            </h2>

                        </div>


                        <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">

                            <FiDollarSign
                                size={24}
                            />

                        </div>

                    </div>

                </div>


                {/* TODAY ORDERS */}

                <div className="bg-white rounded-xl p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">

                                Today's Orders

                            </p>

                            <h2 className="text-2xl font-bold text-slate-800 mt-2">

                                {orders.today}

                            </h2>

                        </div>


                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">

                            <FiShoppingCart
                                size={24}
                            />

                        </div>

                    </div>

                </div>


                {/* TODAY USERS */}

                <div className="bg-white rounded-xl p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">

                                Today's Users

                            </p>

                            <h2 className="text-2xl font-bold text-slate-800 mt-2">

                                {users.today}

                            </h2>

                        </div>


                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">

                            <FiUsers
                                size={24}
                            />

                        </div>

                    </div>

                </div>


                {/* TOTAL SALES */}

                <div className="bg-white rounded-xl p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">

                                Total Sales

                            </p>

                            <h2 className="text-2xl font-bold text-slate-800 mt-2">

                                {formatMoney(
                                    sales.total
                                )}

                            </h2>

                        </div>


                        <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">

                            <FiDollarSign
                                size={24}
                            />

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                SECOND STATS
            ================================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-5">


                {/* TOTAL ORDERS */}

                <div className="bg-white rounded-xl p-5 shadow-sm">

                    <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">

                            <FiShoppingCart
                                size={23}
                            />

                        </div>


                        <div>

                            <p className="text-sm text-slate-500">

                                Total Orders

                            </p>

                            <h2 className="text-2xl font-bold text-slate-800">

                                {orders.total}

                            </h2>

                        </div>

                    </div>

                </div>


                {/* TOTAL USERS */}

                <div className="bg-white rounded-xl p-5 shadow-sm">

                    <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">

                            <FiUsers
                                size={23}
                            />

                        </div>


                        <div>

                            <p className="text-sm text-slate-500">

                                Total Users

                            </p>

                            <h2 className="text-2xl font-bold text-slate-800">

                                {users.total}

                            </h2>

                        </div>

                    </div>

                </div>


                {/* PENDING */}

                <div className="bg-white rounded-xl p-5 shadow-sm">

                    <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">

                            <FiClock
                                size={23}
                            />

                        </div>


                        <div>

                            <p className="text-sm text-slate-500">

                                Pending Orders

                            </p>

                            <h2 className="text-2xl font-bold text-slate-800">

                                {orders.pending}

                            </h2>

                        </div>

                    </div>

                </div>


                {/* DELIVERED */}

                <div className="bg-white rounded-xl p-5 shadow-sm">

                    <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">

                            <FiCheckCircle
                                size={23}
                            />

                        </div>


                        <div>

                            <p className="text-sm text-slate-500">

                                Delivered Orders

                            </p>

                            <h2 className="text-2xl font-bold text-slate-800">

                                {orders.delivered}

                            </h2>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                GRAPH SECTION
            ================================================= */}

            <div className="bg-white rounded-xl shadow-sm p-5 mt-5">

                <div className="mb-5">

                    <h2 className="text-lg font-semibold text-slate-800">

                        Last 7 Days Sales

                    </h2>

                    <p className="text-sm text-slate-500 mt-1">

                        Sales performance for the last seven days

                    </p>

                </div>


                <div className="w-full h-[320px]">

                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >

                        <LineChart
                            data={
                                formattedChart
                            }
                            margin={{
                                top: 10,
                                right: 20,
                                left: 10,
                                bottom: 10
                            }}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                dataKey="day"
                            />

                            <YAxis />

                            <Tooltip
                                formatter={(
                                    value
                                ) =>
                                    formatMoney(
                                        value
                                    )
                                }
                            />

                            <Line
                                type="monotone"
                                dataKey="sales"
                                stroke="#16a34a"
                                strokeWidth={3}
                                dot={{
                                    r: 5
                                }}
                                activeDot={{
                                    r: 7
                                }}
                            />

                        </LineChart>

                    </ResponsiveContainer>

                </div>

            </div>


            {/* =================================================
                ORDER STATUS
            ================================================= */}

            <div className="bg-white rounded-xl shadow-sm p-5 mt-5">

                <h2 className="text-lg font-semibold text-slate-800">

                    Order Status

                </h2>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">


                    <div className="flex items-center justify-between bg-slate-50 rounded-lg p-4">

                        <div className="flex items-center gap-3">

                            <FiRefreshCw
                                className="text-blue-500"
                            />

                            <span className="text-sm text-slate-600">

                                Processing Orders

                            </span>

                        </div>


                        <span className="font-bold text-slate-800">

                            {orders.processing}

                        </span>

                    </div>


                    <div className="flex items-center justify-between bg-slate-50 rounded-lg p-4">

                        <div className="flex items-center gap-3">

                            <FiTruck
                                className="text-green-500"
                            />

                            <span className="text-sm text-slate-600">

                                Delivered Orders

                            </span>

                        </div>


                        <span className="font-bold text-slate-800">

                            {orders.delivered}

                        </span>

                    </div>

                </div>

            </div>


        </div>

    );

}