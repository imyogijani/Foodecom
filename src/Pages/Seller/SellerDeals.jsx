import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './SellerDeals.css';
import { useDeals } from '../../context/DealsContext';

const sellerId = 1; // Simulate logged-in seller

function SellerDeals() {
  const { deals, addDeal, updateDeal, deleteDeal } = useDeals();
  const sellerDeals = deals.filter(d => d.sellerId === sellerId);
  const [form, setForm] = useState({ id: null, title: '', description: '', discount: '', status: 'pending' });
  const [editing, setEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      updateDeal({ ...form, discount: Number(form.discount), sellerId });
      setEditing(false);
    } else {
      addDeal({ ...form, discount: Number(form.discount), sellerId });
    }
    setForm({ id: null, title: '', description: '', discount: '', status: 'pending' });
    setShowModal(false);
  };

  const handleEdit = (deal) => {
    setForm(deal);
    setEditing(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      deleteDeal(id);
      if (editing && form.id === id) {
        setEditing(false);
        setForm({ id: null, title: '', description: '', discount: '', status: 'pending' });
      }
    }
  };

  const handleOpenModal = () => {
    setForm({ id: null, title: '', description: '', discount: '', status: 'pending' });
    setEditing(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditing(false);
    setForm({ id: null, title: '', description: '', discount: '', status: 'pending' });
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h2 style={{ marginBottom: 24, color: '#222', fontWeight: 700 }}>Seller Deals</h2>
      <button onClick={handleOpenModal} style={{ marginBottom: 24, padding: '10px 22px', background: '#fc8a06', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px rgba(252,138,6,0.08)' }}>
        <FaPlus style={{ marginRight: 8 }} /> Add Deal
      </button>
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: 28, borderRadius: 12, minWidth: 340, boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
            <h3 style={{ marginBottom: 18, color: '#fc8a06', fontWeight: 700 }}>{editing ? 'Edit Deal' : 'Add Deal'}</h3>
            <form onSubmit={handleSubmit}>
              <input
                name="title"
                placeholder="Deal Title"
                value={form.title}
                onChange={handleChange}
                required
                style={{ marginBottom: 12, width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 15 }}
              />
              <input
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                required
                style={{ marginBottom: 12, width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 15 }}
              />
              <input
                name="discount"
                type="number"
                placeholder="Discount %"
                value={form.discount}
                onChange={handleChange}
                required
                min={1}
                max={100}
                style={{ marginBottom: 18, width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 15 }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="submit" style={{ background: '#fc8a06', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 22px', cursor: 'pointer', fontWeight: 600, fontSize: 15 }}>{editing ? 'Update' : 'Add'} Deal</button>
                <button type="button" onClick={handleCloseModal} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: '10px 22px', cursor: 'pointer', fontWeight: 600, fontSize: 15 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 0 }}>
        {sellerDeals.map(deal => (
          <li key={deal.id} style={{ border: '1px solid #fc8a06', borderRadius: 12, padding: 18, marginBottom: 18, background: '#fff9ed', boxShadow: '0 2px 8px rgba(252,138,6,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <strong style={{ fontSize: 18, color: '#222' }}>{deal.title}</strong>
              <span style={{ background: deal.status === 'approved' ? '#28a745' : deal.status === 'pending' ? '#ffa500' : '#dc3545', color: '#fff', borderRadius: 8, padding: '2px 12px', fontSize: 13, fontWeight: 600 }}>{deal.status}</span>
            </div>
            <div style={{ color: '#444', marginBottom: 8 }}>{deal.description}</div>
            <div style={{ color: '#e57a00', fontWeight: 600, marginBottom: 10 }}>Discount: {deal.discount}%</div>
            {(deal.status === 'pending' || deal.status === 'rejected') && (
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => handleEdit(deal)} style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center' }}><FaEdit style={{ marginRight: 6 }} /> Edit</button>
                <button onClick={() => handleDelete(deal.id)} style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center' }}><FaTrash style={{ marginRight: 6 }} /> Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SellerDeals;

