import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

Modal.setAppElement('#root');

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [adminEventIds, setAdminEventIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const quillRef = useRef(null);
  const quillInstance = useRef(null);

  const [newOrder, setNewOrder] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    tShirtSize: 'Small',
    total: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching admin events and orders");
    const fetchAdminEvents = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          setError('No token found');
          return;
        }
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/events`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const eventIds = response.data.event_id || [];
        setAdminEventIds(eventIds);
        
        // If there's only one event, set it as the selected event
        if (eventIds.length === 1) {
          const event = events.find(e => e.id === eventIds[0]);
          if (event) {
            setSelectedEvent(event);
            setEditModalIsOpen(true);
          }
        }
      } catch (error) {
        console.error('Error fetching admin events:', error);
        setError('Error fetching admin events');
      }
    };

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          setError('No token found');
          return;
        }
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
        console.log("Orders fetched:", response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Error fetching orders');
      }
    };

    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          setError('No token found');
          return;
        }
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/events`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(response.data);
        console.log("Events fetched:", response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Error fetching events');
      }
    };

    fetchAdminEvents();
    fetchOrders();
    fetchEvents();

    const ws = new WebSocket('wss://banatcom-event-app.herokuapp.com');
    ws.onopen = () => {
      console.log('WebSocket connection established');
    };
    ws.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      const newOrder = JSON.parse(event.data);
      setOrders((prevOrders) => [...prevOrders, newOrder]);
    };
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    if (adminEventIds.length === 1 && events.length > 0) {
      const event = events.find(e => e.id === adminEventIds[0]);
      if (event) {
        console.log("Single event found, opening edit modal:", event);
        setSelectedEvent(event);
        setEditModalIsOpen(true);
      }
    }
  }, [adminEventIds, events]);

  useEffect(() => {
    if (editModalIsOpen && selectedEvent && quillRef.current) {
      console.log("Initializing Quill editor for event:", selectedEvent);
      if (!quillInstance.current) {
        quillInstance.current = new Quill(quillRef.current, {
          theme: 'snow',
          modules: {
            toolbar: true,
            clipboard: {
              matchVisual: false,
            },
          },
        });
        quillInstance.current.on('text-change', () => {
          setSelectedEvent((prev) => ({
            ...prev,
            description: quillInstance.current.root.innerHTML,
          }));
        });
      }
      if (quillInstance.current && selectedEvent) {
        quillInstance.current.root.innerHTML = selectedEvent.description;
        quillInstance.current.format('direction', 'ltr'); // Add this line
      }
    }
  }, [editModalIsOpen, selectedEvent]);

  const handleAddOrder = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('No token found');
        return;
      }

      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/admin/orders`, {
        ...newOrder,
        eventId: adminEventIds[0], // Assuming adminEventIds is an array and taking the first event ID
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders([...orders, response.data]);
      setModalIsOpen(false);
      setNewOrder({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        tShirtSize: 'Small',
        total: 0,
      });
    } catch (error) {
      console.error('Error adding order:', error);
      setError('Error adding order');
    }
  };

  const handleDownloadCSV = async (order) => {
    const orderData = [
      ['Receipt Number', order.order_number],
      ['First Name', order.first_name],
      ['Last Name', order.last_name],
      ['Event Name', order.event_title],
      ['Event ID', order.event_id],
      ['Total', `$${(order.total / 100).toFixed(2)}`],
      ['Phone Number', order.phone_number],
      ['Email', order.email],
      ['Shirt Size', order.t_shirt_size]
    ];

    const csvContent = orderData.map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${order.first_name}_${order.last_name}_receipt.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const handleDownloadAllCSV = async () => {
    const allOrdersData = [
      ['Receipt Number', 'First Name', 'Last Name', 'Event Name', 'Event ID', 'Total', 'Phone Number', 'Email', 'Shirt Size'],
      ...orders.map(order => [
        order.order_number,
        order.first_name,
        order.last_name,
        order.event_title,
        order.event_id,
        `$${(order.total / 100).toFixed(2)}`,
        order.phone_number,
        order.email,
        order.t_shirt_size
      ])
    ];

    const csvContent = allOrdersData.map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'all_orders_receipts.csv');
    document.body.appendChild(link);
    link.click();
  };

  const handleClearOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('No token found');
        return;
      }
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders([]);
    } catch (error) {
      console.error('Error clearing orders:', error);
      setError('Error clearing orders');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('No token found');
        return;
      }
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/orders/${orderId}`, {
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

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openEditModal = (event) => {
    console.log("Opening edit modal for event:", event);
    setSelectedEvent(event);
    setEditModalIsOpen(true);
  };

  const closeEditModal = () => {
    console.log("Closing edit modal");
    if (adminEventIds.length !== 1) {
      setEditModalIsOpen(false);
      setSelectedEvent(null);
      if (quillInstance.current) {
        quillInstance.current = null;
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  const handleEditEvent = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('No token found');
        return;
      }

      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/events/${selectedEvent.id}`, {
        description: selectedEvent.description
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the local events state
      setEvents(events.map(event => (event.id === selectedEvent.id ? selectedEvent : event)));
      setEditModalIsOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error updating event:', error);
      setError('Error updating event');
    }
  };

  const filteredOrders = orders.filter(order =>
    order.order_number.includes(searchTerm) ||
    order.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.phone_number.includes(searchTerm) ||
    order.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEvents = events.filter(event =>
    adminEventIds.includes(event.id)
  );

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#D1D1C1] to-[#073B4C] p-8">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-md p-8 overflow-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#073B4C]">Admin Dashboard</h1>
        <div className="flex justify-between mb-6">
          <button
            onClick={handleDownloadAllCSV}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Download All Orders CSV
          </button>
          <button
            onClick={handleClearOrders}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
          >
            Clear Orders
          </button>
        </div>
        <button
          onClick={openModal}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200 mb-4"
        >
          Add Order
        </button>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search orders..."
          className="mb-4 p-2 border border-gray-300 rounded-md w-full"
        />
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receipt Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  First Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shirt Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders
                .filter(order => adminEventIds.includes(order.event_id)) // Filter orders based on admin's event
                .map((order) => (
                  <tr key={`order-${order.id}`}>
                    <td className="px-6 py-4 whitespace-nowrap">{order.order_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.first_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.last_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.event_title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.event_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${(order.total / 100).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.phone_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.t_shirt_size}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDownloadCSV(order)}
                        className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition duration-200 ml-2"
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
        <h2 className="text-2xl font-bold text-center mb-6 text-[#073B4C]">Events</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.map((event) => (
                <tr key={`event-${event.id}`}>
                  <td className="px-6 py-4 whitespace-nowrap">{event.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{event.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{event.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => openEditModal(event)}
                      className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 transition duration-200 ml-2"
                    >
                      Edit Description
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
        onRequestClose={closeModal}
        contentLabel="Add Order Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <form onSubmit={handleAddOrder} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-[#073B4C]">Add Order</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={newOrder.firstName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={newOrder.lastName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={newOrder.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={newOrder.phoneNumber}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">T-Shirt Size</label>
            <select
              name="tShirtSize"
              value={newOrder.tShirtSize}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="X-Large">X-Large</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Total</label>
            <input
              type="number"
              name="total"
              value={newOrder.total}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Add Order
            </button>
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={editModalIsOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Event Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-[#073B4C]">Edit Event Description</h2>
          <div ref={quillRef} className="quill-editor" style={{ direction: 'ltr' }} />
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={closeEditModal}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200 mr-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleEditEvent}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminPage;
