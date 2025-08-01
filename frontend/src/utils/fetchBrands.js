// Utility to fetch all brands
import axios from "../utils/axios";

export const fetchBrands = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("/api/brands", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.success) {
      return response.data.brands;
    }
    return [];
  } catch (error) {
    return [];
  }
};
