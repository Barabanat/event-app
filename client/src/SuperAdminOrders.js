import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SuperAdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('superadminToken');
        console.log('Superadmin Token:', token); // Log the token to ensure it is being retrieved
        const response = await axios.get('/api/superadmin/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Error fetching orders');
      }
    };

    fetchOrders();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>All Orders</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order Number</th>
            <th>Total</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>T-Shirt Size</th>
            <th>Created At</th>
            <th>Event ID</th>
            <th>Event Title</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{order.order_number}</td>
              <td>{(order.total / 100).toFixed(2)}</td>
              <td>{order.first_name}</td>
              <td>{order.last_name}</td>
              <td>{order.email}</td>
              <td>{order.phone_number}</td>
              <td>{order.t_shirt_size}</td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
              <td>{order.event_id}</td>
              <td>{order.event_title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SuperAdminOrders;
