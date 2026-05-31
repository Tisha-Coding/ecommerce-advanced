import React from "react";
import axios from "axios";
import { useState } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(backendUrl + "/api/user/admin", {
        email,
        password,
      });
      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Login successful");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-black opacity-5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-black opacity-5 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-black">Admin Panel</h1>
          <p className="text-gray-600 text-sm mt-2">Secure Access Required</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
          <form onSubmit={onSubmitHandler} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800 block">
                Email Address
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-10 outline-none bg-gray-50 hover:bg-white"
                type="email"
                placeholder="admin@example.com"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800 block">
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-10 outline-none bg-gray-50 hover:bg-white"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Login Button */}
            <button
              className="w-full mt-8 py-3 px-4 rounded-lg font-semibold text-white bg-black hover:bg-gray-900 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer Text */}
          <p className="text-center text-xs text-gray-500 mt-6 pt-6 border-t border-gray-100">
            Admin credentials required • Secure access only
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
