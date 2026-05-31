import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* 404 Number */}
        <h1 className="text-8xl font-bold text-gray-800 mb-4">404</h1>

        {/* Error title */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-3">
          Page Not Found
        </h2>

        {/* Error description */}
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist. Check the URL and try again.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2.5 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-900 transition-colors"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 border border-gray-400 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
