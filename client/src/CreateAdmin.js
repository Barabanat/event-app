// src/CreateAdmin.js
import React, { useState } from 'react';

const CreateAdmin = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [eventId, setEventId] = useState('');

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('superadminToken');
      const response = await fetch('/api/superadmin/create-admin', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username, password, eventId }),
      });
      if (response.ok) {
        alert('Admin created successfully');
        onClose(); // Close the modal after successful creation
      } else {
        const errorData = await response.json();
        alert(errorData);
      }
    } catch (error) {
      console.error('Error creating admin:', error);
    }
  };

  return (
    <form onSubmit={handleCreateAdmin}>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required className="block mb-2 p-2 border border-gray-300 rounded" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="block mb-2 p-2 border border-gray-300 rounded" />
      <input type="text" value={eventId} onChange={(e) => setEventId(e.target.value)} placeholder="Event ID" required className="block mb-2 p-2 border border-gray-300 rounded" />
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200">Create Admin</button>
    </form>
  );
};

export default CreateAdmin;
