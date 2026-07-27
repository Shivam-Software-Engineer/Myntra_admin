import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, User, Lock, Store } from "lucide-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Redux Toolkit/Slice/loginSlice";
import { useNavigate } from "react-router";


export default function Login() {
    let [showpassword, setShowPassword] = useState(false);
    const BaseUrl = import.meta.env.VITE_BASE_URL;
    let dispatch = useDispatch();
    let navigate = useNavigate();
    let user = useSelector((store) => store.login.user);
    const [formData, setFormData] = useState({
        uname: "",
        pass: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const getValue = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const loginAdmin = (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        axios.post(`${BaseUrl}/auth/login`, { uname: formData.uname, pass: formData.pass })
            .then((res) => res.data)
            .then((finalRes) => {
                console.log(finalRes);
                dispatch(login(finalRes.data));

                setLoading(false);

                // localStorage.setItem("token", finalRes.token)
                // navigate("/admin")
            })
            .catch((err) => {
                setLoading(false);

                setError(
                    err?.response?.data?.error || "Invalid username or password."
                );
            });
            setFormData({
                uname: "",
                pass: "",
            })
    };

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                {/* Logo */}


                {/* Heading */}
                <h2 className="text-3xl font-bold text-center text-slate-800">
                    Admin Login
                </h2>

                <p className="text-center text-gray-500 mt-2 mb-8">
                    Login to access your dashboard
                </p>

                {/* Error */}
                {error && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={loginAdmin} className="space-y-5">
                    {/* Username */}

                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700">
                            Username
                        </label>

                        <div className="relative">
                            <User
                                size={18}
                                className="absolute left-4 top-4 text-gray-400"
                            />

                            <input
                                type="text"
                                name="uname"
                                value={formData.uname}
                                onChange={getValue}
                                placeholder="Enter Username"
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                    </div>

                    {/* Password */}

                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700">
                            Password
                        </label>

                        <div className="relative">
                            <Lock
                                size={18}
                                className="absolute left-4 top-4 text-gray-400"
                            />

                            <input
                                type={showpassword ? "text" : "password"}
                                name="pass"
                                value={formData.pass}
                                onChange={getValue}
                                placeholder="Enter Password"
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-teal-500"
                            />

                            {showpassword ? (
                                <FaEyeSlash
                                    className="absolute right-5 top-4 text-gray-400 cursor-pointer"
                                    onClick={() => setShowPassword(!showpassword)}
                                />
                            ) : (

                                <FaEye
                                    className="absolute right-5 top-4 text-gray-400 cursor-pointer"
                                    onClick={() => setShowPassword(!showpassword)}
                                />
                            )}

                        </div>

                    </div>

                    {/* Button */}

                    <button
                        disabled={loading}
                        className={`w-full h-12 rounded-xl font-semibold text-white transition flex justify-center items-center gap-2 ${loading
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-teal-600 hover:bg-teal-700"
                            }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Logging In...
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}