import axios from "../../utils/axios";

export const addToCartAPI = async (userId, product) => {
  const response = await axios.post("/api/cart/add", {
    userId,
    product,
  });

  return response.data;
};

export const getCartByUserAPI = async (userId) => {
  const response = await axios.get(`/api/cart/${userId}`);
  return response.data;
};


export const updateCartItemAPI = async (userId, productId, quantity) => {
  const response = await axios.post("/api/cart/update", {
    userId,
    productId,
    quantity,
  });
  return response.data;
};