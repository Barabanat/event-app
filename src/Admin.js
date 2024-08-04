import React, { useState, useEffect } from 'react';

const Admin = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data);
    };

    fetchOrders();

    const ws = new WebSocket('ws://localhost:3001');

    ws.onmessage = (message) => {
      const newOrder = JSON.parse(message.data);
      setOrders((prevOrders) => [...prevOrders, newOrder]);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleDownloadCSV = async () => {
    const response = await fetch('/api/orders/download');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleClearOrders = async () => {
    await fetch('/api/orders', {
      method: 'DELETE',
    });
    setOrders([]);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Admin Page</h2>
      <button
        onClick={handleDownloadCSV}
        className="mb-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
      >
        Download Orders as CSV
      </button>
      <button
        onClick={handleClearOrders}
        className="mb-4 bg-red-500 text-white p-2 rounded-md hover:bg-red-600 ml-2"
      >
        Clear All Orders
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Order Number</th>
              <th className="px-4 py-2">Event</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">T-Shirt Size</th>
              <th className="px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderNumber}>
                <td className="border px-4 py-2">{order.orderNumber}</td>
                <td className="border px-4 py-2">{order.event.title}</td>
                <td className="border px-4 py-2">{order.event.date}</td>
                <td className="border px-4 py-2">{order.event.location}</td>
                <td className="border px-4 py-2">{order.formData.firstName} {order.formData.lastName}</td>
                <td className="border px-4 py-2">{order.formData.email}</td>
                <td className="border px-4 py-2">{order.formData.phoneNumber}</td>
                <td className="border px-4 py-2">{order.formData.tShirtSize}</td>
                <td className="border px-4 py-2">${(order.total / 100).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
