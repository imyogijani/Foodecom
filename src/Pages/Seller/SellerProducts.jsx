import React from "react";
import "../../App.css";
import "./SellerProducts.css";

const tempProducts = [
  // Items from orders
  {
    id: 1,
    name: "Classic Burger",
    category: "Fast Food",
    price: 12.99,
    stock: 50,
    status: "In Stock"
  },
  {
    id: 2,
    name: "French Fries",
    category: "Fast Food",
    price: 4.99,
    stock: 100,
    status: "In Stock"
  },
  {
    id: 3,
    name: "Coca Cola",
    category: "Beverages",
    price: 2.99,
    stock: 200,
    status: "In Stock"
  },
  {
    id: 4,
    name: "Margherita Pizza",
    category: "Italian",
    price: 15.99,
    stock: 30,
    status: "In Stock"
  },
  {
    id: 5,
    name: "Garlic Bread",
    category: "Italian",
    price: 4.99,
    stock: 40,
    status: "In Stock"
  },
  {
    id: 6,
    name: "Chicken Wings",
    category: "Appetizers",
    price: 12.99,
    stock: 45,
    status: "In Stock"
  },
  {
    id: 7,
    name: "Caesar Salad",
    category: "Salads",
    price: 8.99,
    stock: 25,
    status: "In Stock"
  },
  {
    id: 8,
    name: "Chocolate Cake",
    category: "Desserts",
    price: 6.99,
    stock: 15,
    status: "Low Stock"
  },
  {
    id: 9,
    name: "Soft Drinks",
    category: "Beverages",
    price: 2.99,
    stock: 150,
    status: "In Stock"
  },
  {
    id: 10,
    name: "Veggie Pizza",
    category: "Italian",
    price: 14.99,
    stock: 25,
    status: "In Stock"
  },
  {
    id: 11,
    name: "Pasta Alfredo",
    category: "Italian",
    price: 12.99,
    stock: 30,
    status: "In Stock"
  },
  {
    id: 12,
    name: "Grilled Chicken",
    category: "Main Course",
    price: 16.99,
    stock: 35,
    status: "In Stock"
  },
  {
    id: 13,
    name: "Mashed Potatoes",
    category: "Sides",
    price: 5.99,
    stock: 40,
    status: "In Stock"
  },
  {
    id: 14,
    name: "Garden Salad",
    category: "Salads",
    price: 7.99,
    stock: 30,
    status: "In Stock"
  }
];

const SellerProducts = () => {
  return (
    <div className="admin-products">
      <div className="admin-header">
        <h1>Products</h1>
        <p className="admin-subtitle">Manage your products and inventory</p>
      </div>
      <div className="products-container">
        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tempProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`status-badge ${product.status.toLowerCase().replace(' ', '-')}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn edit">Edit</button>
                    <button className="action-btn delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerProducts; 