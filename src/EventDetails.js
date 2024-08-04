import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdLocationOn, MdEvent, MdAccessTime } from 'react-icons/md';
import DOMPurify from 'dompurify';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${id}`);
        const data = await response.json();
        setEvent(data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching event details');
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleGetTickets = () => {
    navigate(`/checkout/${id}`, { state: event });
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
    return `${formattedHour.toString().padStart(2, '0')}:${minute} ${period}`;
  };

  if (loading) {
    return <p className="text-center mt-10 text-xl">Loading...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-xl text-red-500">{error}</p>;
  }

  const sanitizedDescription = DOMPurify.sanitize(event.description);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D1D1C1] to-[#073B4C] flex justify-center items-center py-8 px-4">
      <div className="container mx-auto max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <img 
          src={event.image_url} 
          alt={event.title} 
          className="w-full h-96 object-cover object-center"
        />
        <div className="p-6">
          <h1 className="text-4xl font-bold text-[#073B4C] mb-2">{event.title}</h1>
          <p className="text-3xl font-bold text-[#073B4C] mb-6">${(event.price / 100).toFixed(2)}</p>
          <div className="flex items-center text-gray-600 mb-4">
            <MdEvent className="h-6 w-6 mr-2" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-4">
            <MdLocationOn className="h-6 w-6 mr-2" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-4">
            <MdAccessTime className="h-6 w-6 mr-2" />
            <span>{`Start Time: ${formatTime(event.start_time)}, End Time: ${formatTime(event.end_time)}`}</span>
          </div>
          <p className="text-lg text-gray-600 mb-6">Presented by {event.presenter || 'Organizer'}</p>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">About this event</h2>
            <div
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
            />
          </div>
          <div className="flex justify-end">
            <button 
              className="w-full bg-[#073B4C] text-white py-3 px-6 rounded-lg hover:bg-[#065A60] transition duration-200 text-lg font-semibold"
              onClick={handleGetTickets}
            >
              Get Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
