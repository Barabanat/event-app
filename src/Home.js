import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock, DollarSign, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();

    const ws = new WebSocket('ws://localhost:3001');

    ws.onmessage = (message) => {
      const newEvent = JSON.parse(message.data);
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      setFilteredEvents((prevEvents) => [...prevEvents, newEvent]);
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const results = events.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(results);
  }, [searchTerm, events]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB]">
      <header className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-6 flex justify-center items-center">
          <motion.div 
            className="relative"
            initial={false}
            animate={isSearchFocused ? { width: "300px" } : { width: "200px" }}
            transition={{ duration: 0.3 }}
          >
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#073B4C]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl">
            <AnimatePresence initial={false}>
              <motion.img
                key={events[currentIndex]?.id}
                src={events[currentIndex]?.image_url}
                alt={events[currentIndex]?.title}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h2 className="text-4xl font-bold mb-4">{events[currentIndex]?.title}</h2>
              <p className="text-xl mb-4">{events[currentIndex]?.location}</p>
              <Link to={`/events/${events[currentIndex]?.id}`} className="inline-block bg-[#073B4C] text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-[#052D3A] transition duration-300">
                Learn More
              </Link>
            </div>
            {events.length > 1 && (
              <>
                <button 
                  onClick={handlePrevious} 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-3 shadow-md hover:bg-white transition duration-200"
                >
                  <ChevronLeft size={30} className="text-[#073B4C]" />
                </button>
                <button 
                  onClick={handleNext} 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-3 shadow-md hover:bg-white transition duration-200"
                >
                  <ChevronRight size={30} className="text-[#073B4C]" />
                </button>
              </>
            )}
          </div>
        </section>

        {/* Featured Events Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-[#073B4C]">Featured Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.slice(0, 6).map((event) => (
              <Link to={`/events/${event.id}`} key={event.id} className="block">
                <motion.div 
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img src={event.image_url} alt={event.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Calendar size={16} className="mr-2" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin size={16} className="mr-2" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Clock size={16} className="mr-2" />
                      <span>{formatTime(event.start_time)} - {formatTime(event.end_time)}</span>
                    </div>
                    <div className="flex items-center text-[#073B4C] font-bold">
                      <DollarSign size={16} className="mr-1" />
                      <span>{(event.price / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-[#073B4C] text-white rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Experience Amazing Events?</h2>
          <p className="text-xl mb-8">Join us for unforgettable moments and create lasting memories.</p>
        </section>
      </main>
    </div>
  );
};

export default Home;