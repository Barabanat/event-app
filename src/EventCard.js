import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ id, title, date, location, price, imageUrl }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
    <img src={imageUrl} alt={title} className="w-full h-40 object-cover" />
    <div className="p-4">
      <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">{id}</div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-sm text-gray-600 mb-1">{date}</p>
      <p className="text-sm text-gray-600 mb-2">{location}</p>
      {price && <p className="text-sm font-semibold">From ${price}</p>}
      <Link 
        to={{
          pathname: `/checkout/${id}`,
          state: { id, title, date, location, price }
        }}
      >
        <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Checkout</button>
      </Link>
    </div>
  </div>
);

export default EventCard;
