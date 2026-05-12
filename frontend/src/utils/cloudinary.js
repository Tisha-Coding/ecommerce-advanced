// Cloudinary URL mein width transformations inject karta hai srcset ke liye
// URL format: https://res.cloudinary.com/cloud/image/upload/v123/products/img.jpg
// Output:     https://res.cloudinary.com/cloud/image/upload/w_400,f_auto,q_auto/v123/products/img.jpg 400w, ...
export const getCloudinarySrcSet = (url, widths = [400, 700]) => {
  if (!url || !url.includes("cloudinary.com")) return "";
  const marker = "/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return "";
  const before = url.slice(0, idx + marker.length);
  const after = url.slice(idx + marker.length);
  return widths.map((w) => `${before}w_${w},f_auto,q_auto/${after} ${w}w`).join(", ");
};
