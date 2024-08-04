import React from 'react';
import { Link } from 'react-router-dom';

const EventSection = ({ title, events }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <Link to={`/events/${event.id}`} key={event.id} className="block bg-white shadow-md rounded-md p-4 hover:shadow-lg transition duration-200">
            <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover rounded-t-md" />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <p className="text-gray-600">{event.date}</p>
              <p className="text-gray-600">{event.location}</p>
              <p className="text-gray-800 font-bold">${(event.price / 100).toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EventSection;
