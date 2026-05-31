import React from "react";
import { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import axios from "axios";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id, name) => {
    setDeleteConfirm({ id, name });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id: deleteConfirm.id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Product Inventory</h1>
        <p className="text-gray-600">Manage all your NEXUS products</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 py-16 flex flex-col items-center justify-center">
          <svg className="w-10 h-10 animate-spin text-black mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-500">Loading products...</p>
        </div>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 py-16 text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-900 mb-2">No Products Yet</p>
          <p className="text-gray-600">Start by adding your first product to the catalog.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Table Header - Desktop */}
          <div className="hidden md:grid grid-cols-[80px_1fr_120px_120px_100px] gap-4 items-center py-4 px-6 bg-gray-50 border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Image</span>
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Product Name</span>
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</span>
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Price</span>
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">Action</span>
          </div>

          {/* Product Rows */}
          <div className="divide-y divide-gray-100">
            {list.map((item, index) => (
              <div
                className="grid grid-cols-[80px_1fr_120px_120px_100px] gap-4 items-center py-4 px-6 hover:bg-gray-50 transition-colors"
                key={index}
              >
                {/* Image */}
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                />

                {/* Name */}
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.subCategory}</p>
                </div>

                {/* Category */}
                <div>
                  <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                    {item.category}
                  </span>
                </div>

                {/* Price */}
                <div>
                  <p className="font-semibold text-gray-900">
                    {currency}{Number(item.price || 0).toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2
                    })}
                  </p>
                </div>

                {/* Delete Button */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(item._id, item.name)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                    title="Delete product"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Stats */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Total Products: <span className="font-semibold text-gray-900">{list.length}</span>
            </span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
            <div className="bg-red-50 px-6 py-4 border-b border-red-200">
              <h3 className="text-lg font-bold text-red-900">Delete Product</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <span className="font-semibold">"{deleteConfirm.name}"</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 justify-end px-6 py-4 bg-gray-50 border-t border-gray-100">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
