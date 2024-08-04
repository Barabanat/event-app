// src/OrderList.js
import React from 'react';

const OrderList = ({ orders }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Orders</h2>
    <ul>
      {orders.map(order => (
        <li key={order.id} className="mb-6 p-4 bg-gray-100 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <div>
              <strong>Order Number:</strong> {order.order_number}
            </div>
            <div className={`text-sm ${order.status === 'Shipped' ? 'text-green-500' : order.status === 'Cancelled' ? 'text-red-500' : 'text-yellow-500'}`}>
              {order.status}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <strong>Event:</strong> {order.event_id}
            </div>
            <div>
              <strong>Total:</strong> ${(order.total / 100).toFixed(2)}
            </div>
          </div>
          <div className="text-gray-600">
            <strong>Order Date:</strong> {new Date(order.created_at).toLocaleString()}
          </div>
        </li>
      ))}
    </ul>
    <div className="flex justify-center mt-8">
      <button className="px-4 py-2 mx-1 bg-gray-200 rounded">1</button>
      <button className="px-4 py-2 mx-1 bg-gray-200 rounded">2</button>
      <button className="px-4 py-2 mx-1 bg-gray-200 rounded">3</button>
      <button className="px-4 py-2 mx-1 bg-gray-200 rounded">4</button>
    </div>
  </div>
);

export default OrderList;
