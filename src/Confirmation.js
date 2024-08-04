import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Confirmation = () => {
  const location = useLocation();
  const order = location.state?.order;

  useEffect(() => {
    if (order) {
      console.log('Order data:', order);
      generatePDF();
    }
  }, [order]);

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

  const generatePDF = () => {
    if (!order) {
      console.error('Order data is missing');
      return;
    }

    console.log('Generating PDF for order:', order);

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text('Payment Receipt', 105, 20, null, null, 'center');

    doc.setFontSize(12);
    doc.text('Banatcom Payment Solutions', 105, 30, null, null, 'center');

    doc.setFontSize(14);
    doc.text('Invoice to:', 20, 50);

    doc.setFontSize(12);
    doc.text(`Name: ${order.formData.firstName} ${order.formData.lastName}`, 20, 60);
    doc.text(`Email: ${order.formData.email}`, 20, 70);
    doc.text(`Phone Number: ${order.formData.phoneNumber}`, 20, 80);
    doc.text(`T-Shirt Size: ${order.formData.tShirtSize}`, 20, 90);

    doc.text(`Order Number: ${order.orderNumber}`, 20, 110);
    doc.text(`Event: ${order.event.title}`, 20, 120);
    doc.text(`Date: ${formatDate(order.event.date)}`, 20, 130);
    doc.text(`Start Time: ${formatTime(order.event.start_time)}`, 20, 140);
    doc.text(`End Time: ${formatTime(order.event.end_time)}`, 20, 150);
    doc.text(`Location: ${order.event.location}`, 20, 160);
    doc.text(`Payment Method: Card`, 20, 170);

    doc.autoTable({
      startY: 180,
      head: [['Products', 'Quantity', 'Unit Price', 'Amount']],
      body: [
        ['Event Ticket', '1', `$${(order.event.price / 100).toFixed(2)}`, `$${(order.event.price / 100).toFixed(2)}`],
        ['Service Fee', '-', '$0.50', '$0.50'],
      ],
      theme: 'grid',
    });

    doc.text(`Total: $${(order.total / 100).toFixed(2)}`, 20, doc.autoTable.previous.finalY + 10);

    doc.save('receipt.pdf');
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#D1D1C1] to-[#073B4C] flex items-center justify-center py-8 px-4">
        <div className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded-md">
          <h2 className="text-2xl font-bold mb-4">Order Confirmation</h2>
          <p>Error: No order data found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D1D1C1] to-[#073B4C] flex items-center justify-center py-8 px-4">
      <div className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4">Order Confirmation</h2>
        <p>Thank you for your purchase!</p>
        <p>Your order number is: {order.orderNumber}</p>
        <button
          onClick={generatePDF}
          className="mt-4 w-full bg-[#073B4C] text-white p-2 rounded-md hover:bg-[#065A60]"
        >
          Download Receipt
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
