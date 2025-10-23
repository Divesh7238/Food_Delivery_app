const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

// ✅ Safe Image URL Builder
export const buildImageUrl = (img) => {
  if (!img || typeof img !== 'string' || img.trim() === '') return '/fallback-image.png';
  if (img.startsWith("http")) return img;
  // Check if it's a local asset (starts with /src/assets/)
  if (img.startsWith('/src/assets/')) return img;
  const clean = img.replace(/^\/?uploads\//, "");
  return `${API_BASE}/uploads/${clean}`;
};
