// src/ProfileDetails.js
import React from 'react';

const ProfileDetails = ({ user }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Profile</h2>
    <div className="mb-4">
      <strong>Username:</strong> {user.username}
    </div>
    <div className="mb-4">
      <strong>Email:</strong> {user.email}
    </div>
    <div className="mb-4">
      <strong>Phone Number:</strong> {user.phone_number}
    </div>
    <div className="mb-4">
      <strong>Address:</strong> {user.address}
    </div>
  </div>
);

export default ProfileDetails;
