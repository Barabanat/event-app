import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const SuperAdminPage = () => {
  const [events, setEvents] = useState([]);
  const [orders, setOrders] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [error, setError] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [sellerModalIsOpen, setSellerModalIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedEventIds, setSelectedEventIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventModalIsOpen, setEventModalIsOpen] = useState(false);
  const [newSeller, setNewSeller] = useState({ eventId: '', stripeAccountId: '' });
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    price: '',
    imageUrl: '',
    description: '',
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('superadminToken');
        const response = await axios.get('/api/superadmin/events', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Events:', response.data); 
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Error fetching events');
      }
    };

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('superadminToken');
        const response = await axios.get('/api/superadmin/orders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Error fetching orders');
      }
    };

    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem('superadminToken');
        const response = await axios.get('/api/superadmin/admins', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Admins:', response.data); 
        setAdmins(response.data);
      } catch (error) {
        console.error('Error fetching admins:', error);
        setError('Error fetching admins');
      }
    };

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('superadminToken');
        const response = await axios.get('/api/superadmin/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Error fetching users');
      }
    };

    const fetchSellers = async () => { 
      try {
        const token = localStorage.getItem('superadminToken');
        const response = await axios.get('/api/superadmin/sellers', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSellers(response.data);
      } catch (error) {
        console.error('Error fetching sellers:', error);
        setError('Error fetching sellers');
      }
    };

    fetchEvents();
    fetchOrders();
    fetchAdmins();
    fetchUsers();
    fetchSellers(); 

    const ws = new WebSocket('ws://localhost:3001');
    ws.onmessage = (message) => {
      const newOrder = JSON.parse(message.data);
      setOrders((prevOrders) => [...prevOrders, newOrder]);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('superadminToken');
      const response = await axios.post('/api/superadmin/create-admin', {
        username,
        password,
        eventIds: selectedEventIds 
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAdmins([...admins, { id: response.data.adminId, username, event_ids: selectedEventIds }]);
      setModalIsOpen(false);
    } catch (error) {
      console.error('Error creating admin:', error);
      setError('Error creating admin');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('superadminToken');
      const response = await axios.post('/api/superadmin/events', newEvent, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEvents([...events, response.data]);
      setEventModalIsOpen(false);
    } catch (error) {
      console.error('Error creating event:', error);
      setError('Error creating event');
    }
  };

  const handleCreateSeller = async (e) => { 
    e.preventDefault();
    try {
      const token = localStorage.getItem('superadminToken');
      const response = await axios.post('/api/superadmin/sellers', newSeller, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSellers([...sellers, response.data]);
      setSellerModalIsOpen(false);
    } catch (error) {
      console.error('Error creating seller:', error);
      setError('Error creating seller');
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    try {
      const token = localStorage.getItem('superadminToken');
      await axios.delete(`/api/superadmin/admins/${adminId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAdmins(admins.filter(admin => admin.id !== adminId));
    } catch (error) {
      console.error('Error deleting admin:', error);
      setError('Error deleting admin');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('superadminToken');
      await axios.delete(`/api/superadmin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Error deleting user');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('superadminToken');
      await axios.delete(`/api/superadmin/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      setError('Error deleting event');
    }
  };

  const handleDeleteSeller = async (sellerId) => { 
    try {
      const token = localStorage.getItem('superadminToken');
      await axios.delete(`/api/superadmin/sellers/${sellerId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSellers(sellers.filter(seller => seller.id !== sellerId));
    } catch (error) {
      console.error('Error deleting seller:', error);
      setError('Error deleting seller');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('superadminToken');
      await axios.delete(`/api/superadmin/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
      setError('Error deleting order');
    }
  };
  

  const handleDownloadCSV = (order) => {
    const orderData = [
      ['Order ID', order.id],
      ['Order Number', order.order_number],
      ['Total', `$${(order.total / 100).toFixed(2)}`],
      ['First Name', order.first_name],
      ['Last Name', order.last_name],
      ['Email', order.email],
      ['Phone Number', order.phone_number],
      ['T-Shirt Size', order.t_shirt_size],
      ['Created At', new Date(order.created_at).toLocaleString()],
      ['Event ID', order.event_id],
      ['Event Title', order.event_title || 'N/A'] // Handle NULL event title
    ];

    const csvContent = orderData.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `order_${order.order_number}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const handleDownloadAllCSV = () => {
    const allOrdersData = [
      ['Order ID', 'Order Number', 'Total', 'First Name', 'Last Name', 'Email', 'Phone Number', 'T-Shirt Size', 'Created At', 'Event ID', 'Event Title'],
      ...orders.map(order => [
        order.id,
        order.order_number,
        `$${(order.total / 100).toFixed(2)}`,
        order.first_name,
        order.last_name,
        order.email,
        order.phone_number,
        order.t_shirt_size,
        new Date(order.created_at).toLocaleString(),
        order.event_id,
        order.event_title || 'N/A' // Handle NULL event title
      ])
    ];

    const csvContent = allOrdersData.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'all_orders.csv');
    document.body.appendChild(link);
    link.click();
  };

  const filteredOrders = orders.filter(order => {
    return (
      (order.order_number?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (order.first_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (order.last_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (order.phone_number?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (order.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
  });

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#D1D1C1] to-[#073B4C] p-8">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#073B4C]">SuperAdmin Dashboard</h2>
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4 text-[#073B4C]">Events and Assigned Admins</h3>
          <button
            onClick={() => setEventModalIsOpen(true)}
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200 mb-4"
          >
            Add Event
          </button>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Usernames</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map(event => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{event.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{event.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {event.admins?.map(admin => admin.username).join(', ')} 
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{event.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4 text-[#073B4C]">Admins</h3>
          <button
            onClick={() => setModalIsOpen(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 mb-4"
          >
            Add Admin
          </button>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event IDs</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admins.map(admin => (
                  <tr key={admin.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{admin.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{admin.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {admin.event_ids?.join(', ')} 
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4 text-[#073B4C]">Users</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.phone_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4 text-[#073B4C]">Sellers</h3>
          <button
            onClick={() => setSellerModalIsOpen(true)}
            className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition duration-200 mb-4"
          >
            Add Seller
          </button>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stripe Account ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sellers.map(seller => (
                  <tr key={seller.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{seller.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{seller.event_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{seller.stripe_account_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteSeller(seller.id)}
                        className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-between mb-4">
          <h3 className="text-2xl font-semibold mb-4 text-[#073B4C]">Orders</h3>
          <input
            type="text"
            placeholder="Search Orders"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-4"
          />
          <button
            onClick={handleDownloadAllCSV}
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
          >
            Download All Orders CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">T-Shirt Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.order_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${(order.total / 100).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.first_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.last_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.phone_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.t_shirt_size}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(order.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.event_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.event_title || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDownloadCSV(order)}
                      className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                      Download CSV
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-200 ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Create Admin Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <form onSubmit={handleCreateAdmin} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-[#073B4C]">Create Admin</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Event IDs (comma-separated)</label>
            <input
              type="text"
              value={selectedEventIds}
              onChange={(e) => setSelectedEventIds(e.target.value.split(',').map(id => id.trim()))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setModalIsOpen(false)}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Create Admin
            </button>
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={sellerModalIsOpen}
        onRequestClose={() => setSellerModalIsOpen(false)}
        contentLabel="Create Seller Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <form onSubmit={handleCreateSeller} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-[#073B4C]">Create Seller</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Event ID</label>
            <input
              type="text"
              value={newSeller.eventId}
              onChange={(e) => setNewSeller({ ...newSeller, eventId: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Stripe Account ID</label>
            <input
              type="text"
              value={newSeller.stripeAccountId}
              onChange={(e) => setNewSeller({ ...newSeller, stripeAccountId: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setSellerModalIsOpen(false)}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition duration-200"
            >
              Create Seller
            </button>
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={eventModalIsOpen}
        onRequestClose={() => setEventModalIsOpen(false)}
        contentLabel="Create Event Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <form onSubmit={handleCreateEvent} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-[#073B4C]">Create Event</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="time"
              value={newEvent.startTime}
              onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="time"
              value={newEvent.endTime}
              onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              value={newEvent.price}
              onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              value={newEvent.imageUrl}
              onChange={(e) => setNewEvent({ ...newEvent, imageUrl: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setEventModalIsOpen(false)}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Create Event
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SuperAdminPage;
