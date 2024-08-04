import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#D1D1C1] text-[#2B2D42] py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#073B4C]">About Us</h3>
            <p className="text-sm">
              Banatcom Payment Solutions is a software from the main company{' '}
              <a href="https://banatcom.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#3A86FF] transition-colors duration-300">Banatcom.com</a>. We provide a variety of event management and ticketing services used by event organizers to manage events and by consumers to purchase tickets and register for events.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#073B4C]">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm hover:text-[#3A86FF] transition-colors duration-300">Home</Link></li>
              <li><Link to="/legal/terms" className="text-sm hover:text-[#3A86FF] transition-colors duration-300">Terms and Conditions</Link></li>
              <li><Link to="/legal/terms" className="text-sm hover:text-[#3A86FF] transition-colors duration-300">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#073B4C]">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/banatcomdotcom" target="_blank" rel="noopener noreferrer" className="text-[#2B2D42] hover:text-[#3A86FF] transition-colors duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.597 0-2.917-.01-3.96-.058-.976-.045-1.505-.207-1.858-.344-.466-.182-.8-.398-1.15-.748-.35-.35-.566-.683-.748-1.15-.137-.353-.3-.882-.344-1.857-.047-1.023-.058-1.351-.058-3.807v-.468c0-2.456.011-2.784.058-3.807.045-.975.207-1.504.344-1.857.182-.467.399-.8.748-1.15.35-.35.683-.566 1.15-.748.353-.137.882-.3 1.857-.344 1.054-.048 1.37-.058 4.041-.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-[#073B4C] text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Banatcom Payment Solutions. All rights reserved.</p>
          <p className="text-xs mt-2">
            By using this site, you agree to our{' '}
            <Link to="/legal/terms" className="underline hover:text-[#3A86FF] transition-colors duration-300">Terms and Conditions</Link>{' '}
            and{' '}
            <Link to="/legal/terms" className="underline hover:text-[#3A86FF] transition-colors duration-300">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
