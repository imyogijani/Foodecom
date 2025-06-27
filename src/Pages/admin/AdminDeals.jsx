import React, { useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useDeals } from "../../context/DealsContext";

const statusOptions = ["pending", "approved", "rejected"];

function AdminDeals() {
  const { deals, approveDeal, rejectDeal } = useDeals();
  const [filter, setFilter] = useState("pending");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [dealToReject, setDealToReject] = useState(null);

  const filteredDeals = deals.filter((d) =>
    filter === "all" ? true : d.status === filter
  );

  const handleApprove = (id) => {
    if (window.confirm("Approve this deal?")) {
      approveDeal(id);
    }
  };

  const handleReject = (deal) => {
    setDealToReject(deal);
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (dealToReject) {
      rejectDeal(dealToReject.id);
      setShowRejectModal(false);
      setDealToReject(null);
    }
  };

  const cancelReject = () => {
    setShowRejectModal(false);
    setDealToReject(null);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 32 }}>
      <h2 style={{ marginBottom: 24, color: "#222", fontWeight: 700 }}>
        Admin Deal Management
      </h2>
      <div style={{ marginBottom: 24, display: "flex", gap: 12 }}>
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              background: filter === status ? "#fc8a06" : "#eee",
              color: filter === status ? "#fff" : "#333",
              border: "none",
              borderRadius: 8,
              padding: "8px 20px",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
        <button
          onClick={() => setFilter("all")}
          style={{
            background: filter === "all" ? "#fc8a06" : "#eee",
            color: filter === "all" ? "#fff" : "#333",
            border: "none",
            borderRadius: 8,
            padding: "8px 20px",
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          All
        </button>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredDeals.length === 0 && <li>No deals found.</li>}
        {filteredDeals.map((deal) => (
          <li
            key={deal.id}
            style={{
              border: "1px solid #fc8a06",
              borderRadius: 12,
              padding: 18,
              marginBottom: 18,
              background: "#fff9ed",
              boxShadow: "0 2px 8px rgba(252,138,6,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <strong style={{ fontSize: 18, color: "#222" }}>
                {deal.title}
              </strong>
              <span
                style={{
                  background:
                    deal.status === "approved"
                      ? "#28a745"
                      : deal.status === "pending"
                      ? "#ffa500"
                      : "#dc3545",
                  color: "#fff",
                  borderRadius: 8,
                  padding: "2px 12px",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {deal.status}
              </span>
            </div>
            <div style={{ color: "#444", marginBottom: 8 }}>
              {deal.description}
            </div>
            <div
              style={{ color: "#e57a00", fontWeight: 600, marginBottom: 10 }}
            >
              Discount: {deal.discount}%
            </div>
            <div style={{ color: "#888", fontSize: 13, marginBottom: 10 }}>
              Seller ID: {deal.sellerId}
            </div>
            {deal.status === "pending" && (
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => handleApprove(deal.id)}
                  style={{
                    background: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "8px 18px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FaCheck style={{ marginRight: 6 }} /> Approve
                </button>
                <button
                  onClick={() => handleReject(deal)}
                  style={{
                    background: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "8px 18px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FaTimes style={{ marginRight: 6 }} /> Reject
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      {showRejectModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 28,
              borderRadius: 12,
              minWidth: 320,
              boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
            }}
          >
            <h3 style={{ marginBottom: 18, color: "#dc3545", fontWeight: 700 }}>
              Reject Deal
            </h3>
            <p>
              Are you sure you want to reject the deal{" "}
              <b>{dealToReject?.title}</b>?
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 18,
              }}
            >
              <button
                onClick={confirmReject}
                style={{
                  background: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "10px 22px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                Reject
              </button>
              <button
                onClick={cancelReject}
                style={{
                  background: "#eee",
                  color: "#333",
                  border: "none",
                  borderRadius: 6,
                  padding: "10px 22px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDeals;
