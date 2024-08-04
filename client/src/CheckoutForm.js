import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const CheckoutForm = ({ price }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [subtotal, setSubtotal] = useState(price);
  const [fees, setFees] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const calculatedFees = subtotal * 0.05; // Example fee calculation (5%)
    setFees(calculatedFees);
    setTotal(subtotal + calculatedFees);
  }, [subtotal]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.error(error);
    } else {
      console.log('PaymentMethod created:', paymentMethod);

      // Call your backend to create a payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: total }),
      });

      const paymentIntent = await response.json();

      const { error: confirmError, paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        console.error('Error confirming card payment:', confirmError);
      } else {
        console.log('Payment successful:', confirmedPaymentIntent);
        alert('Payment successful!');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full md:w-1/2 mx-auto">
      <div className="mb-4">
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
        <input type="text" id="firstName" name="firstName" className="mt-1 p-2 block w-full border rounded" required />
      </div>
      <div className="mb-4">
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
        <input type="text" id="lastName" name="lastName" className="mt-1 p-2 block w-full border rounded" required />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" id="email" name="email" className="mt-1 p-2 block w-full border rounded" required />
      </div>
      <div className="mb-4">
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input type="tel" id="phoneNumber" name="phoneNumber" className="mt-1 p-2 block w-full border rounded" required />
      </div>
      <div className="mb-4">
        <label htmlFor="tshirtSize" className="block text-sm font-medium text-gray-700">T-Shirt Size</label>
        <select id="tshirtSize" name="tshirtSize" className="mt-1 p-2 block w-full border rounded" required>
          <option value="">Select Size</option>
          <option value="S">Small</option>
          <option value="M">Medium</option>
          <option value="L">Large</option>
          <option value="XL">Extra Large</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Card Details</label>
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
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Fees: ${fees.toFixed(2)}</p>
        <p>Total: ${total.toFixed(2)}</p>
      </div>
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Pay</button>
    </form>
  );
};

export default CheckoutForm;
