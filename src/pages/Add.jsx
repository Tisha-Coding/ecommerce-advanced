import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import CustomSelect from "../components/CustomSelect";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("MEN");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [sizes, setSizes] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim() || name.trim().length < 3) {
      newErrors.name = "Product name must be at least 3 characters";
    }

    if (!description.trim() || description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!price || parseFloat(price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!image1 && !image2 && !image3 && !image4) {
      newErrors.images = "At least one image is required";
    }

    if (sizes.length === 0) {
      newErrors.sizes = "At least one size must be selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      setIsLoading(true);
      const toastId = toast.loading("Uploading product... This may take a moment");

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.message === "Product added successfully") {
        toast.dismiss(toastId);
        toast.success("Product added successfully! ✅");
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
        setSizes([]);
        setErrors({});
      } else {
        toast.dismiss(toastId);
        toast.error("Failed to add product.");
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("An error occurred while adding the product.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSizeToggle = (size) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size]
    );
    // Clear size error when user selects a size
    if (errors.sizes) {
      setErrors((prev) => ({ ...prev, sizes: "" }));
    }
  };

  const removeImage = (imageNum) => {
    switch (imageNum) {
      case 1:
        setImage1(false);
        break;
      case 2:
        setImage2(false);
        break;
      case 3:
        setImage3(false);
        break;
      case 4:
        setImage4(false);
        break;
    }
    // Clear image error if at least one image remains
    if (errors.images && (image1 || image2 || image3 || image4)) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-sm text-gray-500">Add a new item to your NEXUS catalog</p>
      </div>

      <form
        onSubmit={onSubmitHandler}
        className="space-y-4"
      >
        {/* Image Upload Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Product Images</h2>
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((num) => {
              const image = num === 1 ? image1 : num === 2 ? image2 : num === 3 ? image3 : image4;
              const setImage = num === 1 ? setImage1 : num === 2 ? setImage2 : num === 3 ? setImage3 : setImage4;
              return (
                <div key={num} className="relative group">
                  <label htmlFor={`image${num}`} className="cursor-pointer block">
                    <div className="relative rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 hover:border-black transition-colors">
                      <img
                        className="w-full h-24 object-cover"
                        src={!image ? assets.upload_area : URL.createObjectURL(image)}
                        alt={`Product ${num}`}
                      />
                      {!image && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-medium">Upload</span>
                        </div>
                      )}
                    </div>
                    <input
                      onChange={(e) => {
                        setImage(e.target.files[0]);
                        if (errors.images) {
                          setErrors((prev) => ({ ...prev, images: "" }));
                        }
                      }}
                      type="file"
                      id={`image${num}`}
                      hidden
                      accept="image/*"
                    />
                  </label>
                  {image && (
                    <button
                      type="button"
                      onClick={() => removeImage(num)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow"
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          {errors.images && <p className="text-red-500 text-xs mt-2 font-medium">{errors.images}</p>}
        </div>

        {/* Product Details Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Product Details</h2>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name</label>
            <input
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) {
                  setErrors((prev) => ({ ...prev, name: "" }));
                }
              }}
              value={name}
              className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none ${
                errors.name
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                  : "border-gray-200 focus:border-black focus:ring-1 focus:ring-black focus:ring-opacity-10"
              }`}
              type="text"
              placeholder="e.g., Premium Cotton T-Shirt"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Product Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Description</label>
            <textarea
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) {
                  setErrors((prev) => ({ ...prev, description: "" }));
                }
              }}
              value={description}
              className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none resize-none ${
                errors.description
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                  : "border-gray-200 focus:border-black focus:ring-1 focus:ring-black focus:ring-opacity-10"
              }`}
              rows="2"
              placeholder="Describe your product..."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Category, Subcategory & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CustomSelect
              label="Category"
              value={category}
              onChange={setCategory}
              options={[
                { value: "MEN", label: "Men" },
                { value: "WOMEN", label: "Women" },
                { value: "KIDS", label: "Kids" },
              ]}
            />

            <CustomSelect
              label="Sub Category"
              value={subCategory}
              onChange={setSubCategory}
              options={[
                { value: "Topwear", label: "Topwear" },
                { value: "Bottomwear", label: "Bottomwear" },
                { value: "Winterwear", label: "Winterwear" },
              ]}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price ($)</label>
              <input
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (errors.price) {
                    setErrors((prev) => ({ ...prev, price: "" }));
                  }
                }}
                value={price}
                className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none ${
                  errors.price
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                    : "border-gray-200 focus:border-black focus:ring-1 focus:ring-black focus:ring-opacity-10"
                }`}
                type="number"
                placeholder="99.99"
                min="0"
                step="0.01"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes</label>
            <div className="flex flex-wrap gap-2">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                    sizes.includes(size)
                      ? "bg-black text-white border-black"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {errors.sizes && <p className="text-red-500 text-xs mt-2">{errors.sizes}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-2.5 text-white text-sm font-semibold rounded-lg shadow transition-all ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-900 active:scale-95"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : (
            "Add Product"
          )}
        </button>
      </form>
    </div>
  );
};

export default Add;
