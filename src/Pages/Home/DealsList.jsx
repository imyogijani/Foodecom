import React from 'react';
import { useDeals } from '../../context/DealsContext';

function DealsList() {
  const { deals } = useDeals();
  const approvedDeals = deals.filter(d => d.status === 'approved');

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h2>Available Deals</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {approvedDeals.length === 0 && <li>No deals available.</li>}
        {approvedDeals.map(deal => (
          <li key={deal.id} style={{ border: '1px solid #fc8a06', borderRadius: 8, padding: 16, marginBottom: 16, background: '#fff9ed' }}>
            <strong>{deal.title}</strong> <span style={{ color: '#e57a00' }}>({deal.discount}% off)</span>
            <div>{deal.description}</div>
            <div style={{ fontSize: 12, color: '#888' }}>Seller ID: {deal.sellerId || 'N/A'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DealsList; 