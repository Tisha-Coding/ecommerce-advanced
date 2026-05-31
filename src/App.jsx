import React, { useState, useEffect } from "react";
import Navbar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "$";

const validRoutes = ["/", "/dashboard", "/add", "/list", "/orders"];

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  const isValidRoute = validRoutes.includes(location.pathname);
  const shouldShowLayout = token !== "" && isValidRoute;

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />

      {token === "" ? (
        <Login setToken={setToken} />
      ) : shouldShowLayout ? (
        <>
          <Navbar setToken={setToken} />

          <div className="flex w-full">
            <Sidebar />

            <main className="flex-1 min-w-0 p-6 sm:p-8 text-gray-600 text-base">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard token={token} />} />
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
              </Routes>
            </main>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
