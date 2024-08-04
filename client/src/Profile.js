import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('/api/user/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        data.orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to fetch profile');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  const formatDate = (dateString) => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hour, minute] = timeString.split(':');
    const hourInt = parseInt(hour, 10);
    const period = hourInt >= 12 ? 'PM' : 'AM';
    const formattedHour = hourInt % 12 || 12;
    return `${formattedHour}:${minute} ${period}`;
  };

  const generatePDF = async (order) => {
    if (!order) {
      console.error('Order data is missing');
      return;
    }

    try {
      // Fetch event details using event_id
      const eventResponse = await fetch(`/api/events/${order.event_id}`);
      if (!eventResponse.ok) {
        throw new Error('Failed to fetch event details');
      }
      const eventData = await eventResponse.json();

      const doc = new jsPDF();

      doc.setFontSize(22);
      doc.text('Payment Receipt', 105, 20, null, null, 'center');

      doc.setFontSize(12);
      doc.text('Banatcom Payment Solutions', 105, 30, null, null, 'center');

      doc.setFontSize(14);
      doc.text('Invoice to:', 20, 50);

      doc.setFontSize(12);
      doc.text(`Name: ${order.first_name} ${order.last_name}`, 20, 60);
      doc.text(`Email: ${order.email}`, 20, 70);
      doc.text(`Phone Number: ${order.phone_number}`, 20, 80);
      doc.text(`T-Shirt Size: ${order.t_shirt_size}`, 20, 90);

      doc.text(`Order Number: ${order.order_number}`, 20, 110);
      doc.text(`Event: ${eventData.title}`, 20, 120);
      doc.text(`Date: ${formatDate(eventData.date)}`, 20, 130);
      doc.text(`Start Time: ${formatTime(eventData.start_time)}`, 20, 140);
      doc.text(`End Time: ${formatTime(eventData.end_time)}`, 20, 150);
      doc.text(`Location: ${eventData.location}`, 20, 160);
      doc.text(`Payment Method: Card`, 20, 170);

      doc.autoTable({
        startY: 180,
        head: [['Products', 'Quantity', 'Unit Price', 'Amount']],
        body: [
          ['Event Ticket', '1', `$${(eventData.price / 100).toFixed(2)}`, `$${(eventData.price / 100).toFixed(2)}`],
          ['Service Fee', '-', '$0.50', '$0.50'],
        ],
        theme: 'grid',
      });

      doc.text(`Total: $${(order.total / 100).toFixed(2)}`, 20, doc.autoTable.previous.finalY + 10);

      doc.save('receipt.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const renderContent = () => {
    if (activeTab === 'profile') {
      return (
        <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <h3 className="text-2xl font-semibold text-[#073B4C] mb-4">Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong className="text-[#073B4C]">Username:</strong>
              <p>{profile.user.username}</p>
            </div>
            <div>
              <strong className="text-[#073B4C]">Email:</strong>
              <p className="break-all">{profile.user.email}</p>
            </div>
            <div>
              <strong className="text-[#073B4C]">Phone Number:</strong>
              <p>{profile.user.phone_number}</p>
            </div>
            <div>
              <strong className="text-[#073B4C]">Address:</strong>
              <p>{profile.user.address}</p>
            </div>
          </div>
        </div>
      );
    } else if (activeTab === 'orders') {
      const indexOfLastOrder = currentPage * ordersPerPage;
      const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
      const currentOrders = profile.orders.slice(indexOfFirstOrder, indexOfLastOrder);
      const totalPages = Math.ceil(profile.orders.length / ordersPerPage);

      return (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-2xl font-semibold text-[#073B4C] mb-6">Your Orders</h3>
          <div className="space-y-6">
            {currentOrders.map(order => (
              <div key={order.id} className="border-2 border-[#073B4C] p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong className="text-[#073B4C]">Order Number:</strong>
                    <p>{order.order_number}</p>
                  </div>
                  <div>
                    <strong className="text-[#073B4C]">Event ID:</strong>
                    <p>{order.event_id}</p>
                  </div>
                  <div>
                    <strong className="text-[#073B4C]">Total:</strong>
                    <p>${(order.total / 100).toFixed(2)}</p>
                  </div>
                  <div>
                    <strong className="text-[#073B4C]">Order Date:</strong>
                    <p>{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => generatePDF(order)}
                  className="mt-4 w-full bg-[#073B4C] text-white py-2 px-4 rounded-md hover:bg-[#065A60] transition duration-200"
                >
                  Download Receipt
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`px-4 py-2 mx-1 rounded-md ${currentPage === pageNumber ? 'bg-[#073B4C] text-white' : 'bg-white text-[#073B4C] border border-[#073B4C]'} hover:bg-[#065A60] hover:text-white transition duration-200`}
              >
                {pageNumber}
              </button>
            ))}
          </div>
        </div>
      );
    }
  };

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  if (!profile) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D1D1C1] to-[#073B4C] flex items-center justify-center py-12 px-4">
      <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-5xl">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 mb-6 md:mb-0 md:pr-6 md:border-r">
            <h2 className="text-3xl font-bold mb-6 text-[#073B4C]">{profile.user.username}</h2>
            <nav className="mb-8">
              <ul className="space-y-4">
                {['profile', 'orders'].map((tab) => (
                  <li key={tab}>
                    <button
                      onClick={() => setActiveTab(tab)}
                      className={`text-lg font-semibold w-full text-left py-2 px-4 rounded-md transition duration-200 ${
                        activeTab === tab
                          ? 'bg-[#073B4C] text-white'
                          : 'text-[#073B4C] hover:bg-[#073B4C] hover:text-white'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <button 
              onClick={handleLogout} 
              className="w-full bg-[#F94144] text-white py-2 px-4 rounded-md hover:bg-[#D33F43] transition duration-200"
            >
              Logout
            </button>
          </div>
          <div className="w-full md:w-3/4 md:pl-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
