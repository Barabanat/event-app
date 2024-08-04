import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Checkout from './Checkout';
import Confirmation from './Confirmation';
import AdminPage from './AdminPage';
import CreateAdmin from './CreateAdmin';
import AdminLogin from './AdminLogin';
import SuperAdminPage from './SuperAdminPage';
import SuperAdminLogin from './SuperAdminLogin';
import UserLogin from './UserLogin';
import UserRegister from './UserRegister';
import Profile from './Profile';
import EventDetails from './EventDetails';
import Header from './Header';
import Footer from './Footer';
import LegalTerms from './LegalTerms';
import PrivacyPolicy from './PrivacyPolicy';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Modal from './Modal'; // Import the Modal component

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Header />
        <main className="flex-grow">
          <Elements stripe={stripePromise}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/checkout/:id" element={<Checkout />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/superadmin" element={<SuperAdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminPage />} />
              <Route path="/superadmin/dashboard" element={<SuperAdminPage />} />
              <Route path="/superadmin/create-admin" element={<CreateAdmin />} />
              <Route path="/login" element={<UserLogin />} />
              <Route path="/register" element={<UserRegister />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/legal/terms" element={<LegalTerms />} />
              <Route path="/legal/privacy" element={<PrivacyPolicy />} />
            </Routes>
          </Elements>
        </main>
        <Footer />
        {/* You can conditionally render the modal or call toggleModal from somewhere else */}
        <Modal isOpen={isModalOpen} onClose={toggleModal}>
          <div className="p-4">
            <p>This is a modal content with sufficient margins.</p>
          </div>
        </Modal>
      </Router>
    </div>
  );
}

export default App;
