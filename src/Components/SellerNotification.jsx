import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";

const SellerNotification = () => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/current-user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.user && response.data.user.notification) {
          setNotification(response.data.user.notification);
        }
      } catch (error) {
        // Optionally handle error
      }
    };
    fetchNotification();
  }, []);

  const handleDismiss = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch("/api/v1/auth/clear-notification", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotification(null);
    } catch (error) {
      toast.error("Failed to dismiss notification");
    }
  };

  if (!notification) return null;

  return (
    <div style={{ background: '#fff3cd', color: '#856404', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffeeba', position: 'relative' }}>
      <span>{notification}</span>
      <button onClick={handleDismiss} style={{ position: 'absolute', right: 12, top: 12, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#856404' }}>&times;</button>
    </div>
  );
};

export default SellerNotification;
