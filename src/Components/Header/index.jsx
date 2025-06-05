import React from 'react';
import { FaMapMarkerAlt, FaShoppingCart, FaChevronDown } from 'react-icons/fa';
// import Logo from '../../images/Logo.jpeg';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    // top-strip
    <div
      className="d-flex justify-content-between align-items-center px-3"
      style={{
        backgroundColor: '#fff',
        border: '1px solid #eee',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: 500,
        fontFamily: 'sans-serif',
        marginLeft: '20px',
        marginRight: '20px',
      }}
    >
      {/* Promo Message */}
      <div className="d-flex align-items-center">
        <span className="me-2" role="img" aria-label="sun">🌞</span>
        <span>
          Get 5% Off your first order,&nbsp;
          <span style={{ color: '#e48a00', fontWeight: 700 }}>Promo: ORDER5</span>
        </span>
      </div>

      {/* Location */}
      <div className="d-flex align-items-center">
        <FaMapMarkerAlt className="me-1" style={{ fontSize: '13px' }} />
        <span>Regent Street, A4, A4201, London</span>
        <a
          href="#"
          className="ms-2"
          style={{
            color: '#e48a00',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          Change Location
        </a>
      </div>

      {/* Cart Summary */}
      <div
        className="d-flex align-items-center text-white"
        style={{
          justifyContent: 'space-around',
          height: '8vh',
          width: '20vw',
          backgroundColor: '#028643',
          borderRadius: '0 0 10px 10px',
          textAlign: 'center',
        }}
      >
        <FaShoppingCart className="me-2" style={{fontSize:'25px'}} />
        <span className="me-3" style={{fontSize:'18px'}} >23 Items</span> 
        <span className="me-2" style={{fontSize:'18px'}} >GBP 79.89</span>
        <FaChevronDown />
      </div>

    </div>
        
  );
}
