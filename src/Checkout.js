import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const Checkout = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [event, setEvent] = useState(location.state || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    phoneNumber: '',
    tShirtSize: 'Small',
  });
  const [total, setTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    const fetchEvent = async () => {
      if (!event) {
        try {
          const response = await fetch(`/api/events/${id}`);
          const data = await response.json();
          setEvent(data);
          setLoading(false);
        } catch (error) {
          setError('Error fetching event details');
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, event]);

  useEffect(() => {
    if (event) {
      const fees = 50; // Fees are 50 cents
      const tax = Math.round((event.price + fees) * 0.13); // Assuming a 13% tax rate
      setTotal(event.price + fees + tax);
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Form validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      formData.email !== formData.confirmEmail ||
      !formData.phoneNumber ||
      !agreedToTerms
    ) {
      setErrorMessage('Please fill out all required fields and ensure emails match.');
      if (!agreedToTerms) {
        setErrorMessage('You must agree to the terms and conditions.');
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const paymentIntentResponse = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: total, eventId: event.id }),
      });

      if (!paymentIntentResponse.ok) {
        const errorData = await paymentIntentResponse.json();
        throw new Error(errorData.message || 'Failed to create payment intent');
      }

      const paymentIntent = await paymentIntentResponse.json();

      const cardElement = elements.getElement(CardElement);

      const { error, paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(paymentIntent.client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phoneNumber,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message || 'An unknown error occurred');
      } else {
        const order = {
          orderNumber: confirmedPaymentIntent.id,
          event,
          total,
          formData,
        };

        const token = localStorage.getItem('userToken');
        if (!token) {
          throw new Error('No token found. Please log in again.');
        }

        // Save order to backend
        const saveOrderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(order),
        });

        if (!saveOrderResponse.ok) {
          const errorData = await saveOrderResponse.json();
          throw new Error(errorData.message || 'Failed to save order');
        }

        navigate('/confirmation', { state: { order } });
        setErrorMessage('');
      }
    } catch (error) {
      setErrorMessage(error.message || 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#D1D1C1] to-[#073B4C] flex items-center justify-center py-8 px-4">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-[#073B4C] text-center">Login Required</h2>
          <p className="text-red-500 text-center mb-4">You need to be logged in to proceed with the checkout.</p>
          <button
            className="w-full bg-[#073B4C] text-white py-2 px-4 rounded-md hover:bg-[#065A60] transition duration-200"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D1D1C1] to-[#073B4C] flex justify-center items-center py-8 px-4">
      <div className="container mx-auto max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-[#073B4C]">Billing Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Confirm Email</label>
                <input
                  type="email"
                  name="confirmEmail"
                  value={formData.confirmEmail}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">T-Shirt Size</label>
                <select
                  name="tShirtSize"
                  value={formData.tShirtSize}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  required
                >
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                  <option value="X-Large">X-Large</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Card Details</label>
                <CardElement
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#32325d',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#fa755a',
                      },
                    },
                  }}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  <input
                    type="checkbox"
                    className="mr-2 leading-tight"
                    checked={agreedToTerms}
                    onChange={() => setAgreedToTerms(!agreedToTerms)}
                  />
                  I agree to the total amount owing on this page and that promo codes must be entered before ticket selection and cannot be applied after purchase. I understand my card will be charged by selecting Place Order at the bottom of this page. I also agree to the event's terms and conditions, including no refunds and the event organizer's right to change event details.
                </label>
              </div>
              {errorMessage && (
                <div className="mb-4 p-2 bg-red-100 text-red-800 border border-red-300 rounded">
                  {errorMessage}
                </div>
              )}
              <button
                type="submit"
                className="mt-4 w-full bg-[#073B4C] text-white p-2 rounded-md hover:bg-[#065A60]"
                disabled={!stripe || isSubmitting}
              >
                Place Order
              </button>
            </form>
          </div>
          <div className="p-6 bg-gray-50 border-l border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-[#073B4C]">Order Summary</h2>
            <div className="mb-4">
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p className="text-gray-600">{formatDate(event.date)}</p>
              <p className="text-gray-600">{event.location}</p>
              <p className="text-gray-600">{`Start Time: ${formatTime(event.start_time)}, End Time: ${formatTime(event.end_time)}`}</p>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${(event.price / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Fees</span>
                <span>$0.50</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Tax</span>
                <span>${((event.price + 50) * 0.13 / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Delivery</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between mt-4 font-bold">
                <span>Total</span>
                <span>${(total / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
