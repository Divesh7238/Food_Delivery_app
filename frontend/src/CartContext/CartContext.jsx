import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from "react";
import axios from "axios";

const CartContext = createContext();
const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

// ✅ Safe Image URL Builder
const buildImageUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  const clean = img.replace(/^\/?uploads\//, "");
  return `${API_BASE}/uploads/${clean}`;
};

// ✅ Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case "HYDRATE_CART":
      return (action.payload || []).map((ci) => {
        const it = ci.item || ci; // handle nested or flat structure
        const id = it._id || it.id;
        return {
          id,
          name: it.name,
          price: Number(it.price || 0),
          imageUrl: buildImageUrl(it.imageUrl || it.image),
          cartItemId: ci._id || ci.cartItemId,
          quantity: Number(ci.quantity || 1),
          description: it.description || "",
        };
      });

    case "ADD_ITEM": {
      const { item, quantity, cartItemId } = action.payload;
      const id = item.id || item._id;
      const existing = state.find((i) => i.id === id);
      if (existing) {
        return state.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...state,
        {
          id,
          name: item.name,
          price: Number(item.price || 0),
          imageUrl: buildImageUrl(item.imageUrl || item.image),
          cartItemId: cartItemId || id,
          quantity: quantity || 1,
          description: item.description || "",
        },
      ];
    }

    case "REMOVE_ITEM":
      return state.filter((i) => i.cartItemId !== action.payload.cartItemId);

    case "UPDATE_QUANTITY": {
      const { cartItemId, newQuantity } = action.payload;
      const q = Math.max(1, Number(newQuantity || 1));
      return state.map((i) =>
        i.cartItemId === cartItemId ? { ...i, quantity: q } : i
      );
    }

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
};

// ✅ LocalStorage initializer
const initializer = () => {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, [], initializer);

  // ✅ Sync cart with localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ Fetch server cart if logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const localCart = initializer();

    axios
      .get(`${API_BASE}/api/cart`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          // Merge server cart with local cart
          const serverCart = res.data;

          // Helper to merge carts by id, summing quantities
          const mergedCartMap = new Map();

          localCart.forEach(item => {
            mergedCartMap.set(item.id, { ...item });
          });

          serverCart.forEach(item => {
            const it = item.item;
            const id = it._id;
            if (mergedCartMap.has(id)) {
              mergedCartMap.get(id).quantity += item.quantity;
            } else {
              mergedCartMap.set(id, {
                id,
                name: it.name,
                price: Number(it.price || 0),
                imageUrl: buildImageUrl(it.imageUrl || it.image),
                cartItemId: item._id,
                quantity: item.quantity,
                description: it.description || "",
              });
            }
          });

          const mergedCart = Array.from(mergedCartMap.values());

          dispatch({ type: "HYDRATE_CART", payload: mergedCart });
        }
      })
      .catch((err) => console.error("Cart fetch failed:", err));
  }, []);

  // ✅ Add to cart
  const addToCart = useCallback(async (item, qty = 1) => {
    const id = item.id || item._id;
    const looksMongoId = typeof id === "string" && id.length === 24;

    if (looksMongoId) {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.post(
          `${API_BASE}/api/cart`,
          { itemId: id, quantity: qty },
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        dispatch({
          type: "ADD_ITEM",
          payload: {
            item: { ...item, id },
            quantity: qty,
            cartItemId: res.data._id,
          },
        });
        return;
      } catch (error) {
        console.error("Failed to add to cart:", error);
        alert("⚠️ Login required or server error while adding to cart.");
      }
    }

    dispatch({
      type: "ADD_ITEM",
      payload: { item: { ...item, id }, quantity: qty, cartItemId: id },
    });
  }, []);

  // ✅ Remove from cart
  const removeFromCart = useCallback(async (cartItemId) => {
    if (!cartItemId || String(cartItemId).length < 24) {
      dispatch({ type: "REMOVE_ITEM", payload: { cartItemId } });
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${API_BASE}/api/cart/${cartItemId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch({ type: "REMOVE_ITEM", payload: { cartItemId } });
    } catch (err) {
      console.error("Remove from cart failed:", err);
    }
  }, []);

  // ✅ Update quantity
  const updateQuantity = useCallback(async (cartItemId, qty) => {
    const q = Math.max(1, Number(qty || 1));
    if (!cartItemId || String(cartItemId).length < 24) {
      dispatch({ type: "UPDATE_QUANTITY", payload: { cartItemId, newQuantity: q } });
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `${API_BASE}/api/cart/${cartItemId}`,
        { quantity: q },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch({ type: "UPDATE_QUANTITY", payload: { cartItemId, newQuantity: q } });
    } catch (err) {
      console.error("Update quantity failed:", err);
    }
  }, []);

  // ✅ Clear cart
  const clearCart = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await axios.post(
          `${API_BASE}/api/cart/clear`,
          {},
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
    } catch (err) {
      console.error("Clear cart failed:", err);
    }
    dispatch({ type: "CLEAR_CART" });
  }, []);

  // ✅ Totals
  const cartTotal = cartItems.reduce(
    (sum, i) => sum + Number(i.price || 0) * Number(i.quantity || 0),
    0
  );
  const totalItemsCount = cartItems.reduce(
    (sum, i) => sum + Number(i.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        totalItems: totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
