import React, { useState } from 'react';
import { motion } from 'framer-motion';

const LegalTerms = () => {
  const [activeSection, setActiveSection] = useState('terms');

  const sections = {
    terms: 'Terms of Service',
    community: 'Community Guidelines',
    privacy: 'Privacy Policy',
    cookies: 'Cookie Statement'
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'terms':
        return (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Terms of Service</h2>
            <p className="mb-4">These Terms of Service ("Terms") govern your access to and use of Banatcom's services, including our website, mobile applications, and any other software or services offered by Banatcom in connection to any of the foregoing ("Services").</p>
            <p className="mb-4">Please read these Terms carefully before using the Services. By accessing or using the Services, you agree to be bound by these Terms and all applicable laws and regulations. If you do not agree with any part of these Terms, you may not use our Services.</p>
            <h3 className="text-xl font-semibold mb-2">1. Use of Services</h3>
            <p className="mb-4">You must follow any policies made available to you within the Services. You may use the Services only as permitted by law, including applicable export and re-export control laws and regulations. We may suspend or stop providing our Services to you if you do not comply with our terms or policies or if we are investigating suspected misconduct.</p>
            <p className="mb-4">It is your responsibility to ensure that your use of the Services complies with all applicable laws and regulations. We reserve the right to suspend or terminate access to the Services at any time if we believe you are violating these Terms or engaging in any unlawful activities.</p>
            <h3 className="text-xl font-semibold mb-2">2. Your Banatcom Account</h3>
            <p className="mb-4">You may need a Banatcom Account in order to use some of our Services. You may create your own Banatcom Account, or your Banatcom Account may be assigned to you by an administrator, such as your employer or educational institution. If you are using a Banatcom Account assigned to you by an administrator, different or additional terms may apply and your administrator may be able to access or disable your account.</p>
            <p className="mb-4">You are responsible for safeguarding the password that you use to access the Services and for any activities or actions under your password. We encourage you to use a strong password that is not used on other websites or services. Banatcom will not be liable for any loss or damage arising from your failure to comply with this obligation.</p>
            <h3 className="text-xl font-semibold mb-2">3. Privacy and Data Protection</h3>
            <p className="mb-4">Banatcom’s privacy policies explain how we treat your personal data and protect your privacy when you use our Services. By using our Services, you agree that Banatcom can use such data in accordance with our privacy policies.</p>
            <p className="mb-4">We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. Please review our Privacy Policy to understand our practices regarding your personal data.</p>
            <h3 className="text-xl font-semibold mb-2">4. Content in the Services</h3>
            <p className="mb-4">You are responsible for the content that you post to the Services, including its legality, reliability, and appropriateness. By posting content to the Services, you grant Banatcom the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the Services. You retain any and all of your rights to any content you submit, post or display on or through the Services and you are responsible for protecting those rights.</p>
            <p className="mb-4">You agree not to use the Services to post any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically, or otherwise objectionable. Banatcom reserves the right to remove any content that violates these Terms or is otherwise objectionable.</p>
            <h3 className="text-xl font-semibold mb-2">5. Modifying and Terminating our Services</h3>
            <p className="mb-4">We are constantly changing and improving our Services. We may add or remove functionalities or features, and we may suspend or stop a Service altogether. You can stop using our Services at any time, although we’ll be sorry to see you go. Banatcom may also stop providing Services to you, or add or create new limits to our Services at any time.</p>
            <p className="mb-4">If we discontinue a Service, where reasonably possible, we will give you advance notice and a chance to get information out of that Service.</p>
            <h3 className="text-xl font-semibold mb-2">6. Warranties and Disclaimers</h3>
            <p className="mb-4">We provide our Services using a commercially reasonable level of skill and care and we hope that you will enjoy using them. But there are certain things that we don’t promise about our Services. Other than as expressly set out in these terms or additional terms, neither Banatcom nor its suppliers or distributors make any specific promises about the Services. For example, we don’t make any commitments about the content within the Services, the specific functions of the Services, or their reliability, availability, or ability to meet your needs. We provide the Services “as is”.</p>
            <p className="mb-4">Some jurisdictions provide for certain warranties, like the implied warranty of merchantability, fitness for a particular purpose, and non-infringement. To the extent permitted by law, we exclude all warranties.</p>
            <h3 className="text-xl font-semibold mb-2">7. Liability for our Services</h3>
            <p className="mb-4">When permitted by law, Banatcom, and Banatcom’s suppliers and distributors, will not be responsible for lost profits, revenues, or data, financial losses, or indirect, special, consequential, exemplary, or punitive damages.</p>
            <p className="mb-4">To the extent permitted by law, the total liability of Banatcom, and its suppliers and distributors, for any claims under these terms, including for any implied warranties, is limited to the amount you paid us to use the Services (or, if we choose, to supplying you the Services again).</p>
            <h3 className="text-xl font-semibold mb-2">8. Business Uses of our Services</h3>
            <p className="mb-4">If you are using our Services on behalf of a business, that business accepts these terms. It will hold harmless and indemnify Banatcom and its affiliates, officers, agents, and employees from any claim, suit or action arising from or related to the use of the Services or violation of these terms, including any liability or expense arising from claims, losses, damages, suits, judgments, litigation costs and attorneys’ fees.</p>
            <p className="mb-4">Businesses must ensure that their use of the Services complies with all applicable laws and regulations. Any breach of this obligation will result in the immediate termination of access to the Services.</p>
            <h3 className="text-xl font-semibold mb-2">9. About these Terms</h3>
            <p className="mb-4">We may modify these terms or any additional terms that apply to a Service to, for example, reflect changes to the law or changes to our Services. You should look at the terms regularly. We’ll post notice of modifications to these terms on this page. We’ll post notice of modified additional terms in the applicable Service. Changes will not apply retroactively and will become effective no sooner than fourteen days after they are posted. However, changes addressing new functions for a Service or changes made for legal reasons will be effective immediately. If you do not agree to the modified terms for a Service, you should discontinue your use of that Service.</p>
          </div>
        );
      case 'community':
        return (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Community Guidelines</h2>
            <p className="mb-4">At Banatcom, we're committed to providing a safe and respectful environment for all users. Our Community Guidelines outline the expected behavior and content standards for our platform.</p>
            <h3 className="text-xl font-semibold mb-2">1. Be Respectful</h3>
            <p className="mb-4">Treat others with respect and kindness. Harassment, discrimination, or abusive behavior of any kind will not be tolerated. This includes offensive comments related to race, ethnicity, religion, gender, sexual orientation, disability, or any other personal characteristic.</p>
            <p className="mb-4">We expect all users to engage in positive interactions and contribute to a welcoming community. Constructive feedback and respectful dialogue are encouraged to foster a supportive environment for everyone.</p>
            <h3 className="text-xl font-semibold mb-2">2. Maintain Integrity</h3>
            <p className="mb-4">Honesty and integrity are fundamental to our community. Do not engage in activities such as spamming, phishing, or spreading misinformation. Ensure that your contributions are genuine and your interactions are conducted in good faith.</p>
            <p className="mb-4">If you encounter any suspicious activity or believe that someone is acting dishonestly, please report it to us immediately. We are committed to maintaining the integrity of our platform.</p>
            <h3 className="text-xl font-semibold mb-2">3. Respect Privacy</h3>
            <p className="mb-4">Do not share private or personal information about others without their consent. This includes but is not limited to, personal addresses, phone numbers, email addresses, and other sensitive information. Always be mindful of others' privacy and handle personal data with care.</p>
            <p className="mb-4">We take privacy seriously and expect all users to respect the privacy of others. Any violation of privacy will be addressed promptly and may result in disciplinary action.</p>
            <h3 className="text-xl font-semibold mb-2">4. Intellectual Property</h3>
            <p className="mb-4">Respect the intellectual property rights of others. Do not share or distribute content that you do not have the right to use. This includes copyrighted material, trademarks, and other proprietary information. Always give proper credit to the original creator.</p>
            <p className="mb-4">If you are unsure whether you have the right to share certain content, please refrain from doing so. Respecting intellectual property rights is essential to maintaining a fair and just community.</p>
            <h3 className="text-xl font-semibold mb-2">5. Safe Content</h3>
            <p className="mb-4">Ensure that the content you share is appropriate for all audiences. Do not post or share content that is violent, sexually explicit, or otherwise inappropriate. This includes images, videos, text, and other forms of media.</p>
            <p className="mb-4">We strive to create a safe space for all users. Please be considerate and mindful of the impact your content may have on others. Inappropriate content will be removed, and repeat offenders may face account suspension.</p>
            <h3 className="text-xl font-semibold mb-2">6. Report Violations</h3>
            <p className="mb-4">If you encounter behavior that violates our Community Guidelines, please report it to us immediately. We rely on our community to help us maintain a safe and respectful environment for everyone. Reports will be reviewed promptly and appropriate action will be taken.</p>
            <p className="mb-4">Your vigilance and cooperation are vital to upholding the standards of our community. We appreciate your commitment to keeping Banatcom a positive space for all users.</p>
            <h3 className="text-xl font-semibold mb-2">7. Enforcement</h3>
            <p className="mb-4">Violations of our Community Guidelines may result in actions ranging from a warning to account suspension or termination. We reserve the right to take any action we deem necessary to protect the integrity and safety of our community.</p>
            <p className="mb-4">Our enforcement policies are designed to address violations fairly and consistently. We aim to educate users about our guidelines and encourage compliance through constructive feedback and transparent communication.</p>
            <h3 className="text-xl font-semibold mb-2">8. Changes to Guidelines</h3>
            <p className="mb-4">We may update our Community Guidelines from time to time to reflect changes in our practices or to address emerging issues. We encourage you to review these guidelines regularly to stay informed about our expectations and standards.</p>
            <p className="mb-4">Your continued use of our services constitutes your acceptance of any changes to these guidelines. We value your input and welcome feedback on how we can improve our community standards.</p>
            <h3 className="text-xl font-semibold mb-2">9. Contact Us</h3>
            <p className="mb-4">If you have any questions or concerns about our Community Guidelines, please contact us at banatcomsolutions@gmail.com. We appreciate your cooperation and commitment to making Banatcom a welcoming and respectful community.</p>
          </div>
        );
      case 'privacy':
        return (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
            <p className="mb-4">Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Services.</p>
            <h3 className="text-xl font-semibold mb-2">1. Who We Are</h3>
            <p className="mb-4">Banatcom Payment Solutions provides a variety of event management and ticketing services. Our services are used by event organizers to manage events and by consumers to purchase tickets and register for events.</p>
            <p className="mb-4">We are committed to protecting your personal information and ensuring that it is handled responsibly and in accordance with applicable data protection laws. This Privacy Policy outlines our practices regarding the collection, use, and protection of your personal data.</p>
            <h3 className="text-xl font-semibold mb-2">2. Our Privacy Statement</h3>
            <p className="mb-4">This Privacy Policy sets forth our policy with respect to information that can be associated with or which relates to a person and/or could be used to identify a person ("Personal Data") that is collected from Users on or through the Services. We take the privacy of your Personal Data seriously. Please read this Privacy Policy as it includes important information regarding your Personal Data and other information.</p>
            <p className="mb-4">Our Privacy Policy applies to all users of our services and outlines the types of personal data we collect, how we use and share that data, and your rights and choices regarding your personal data.</p>
            <h3 className="text-xl font-semibold mb-2">3. Personal Data That We Collect</h3>
            <p className="mb-4">When you use or interact with us through the Services, we may collect Personal Data. This includes:</p>
            <ul className="list-disc pl-5 mb-4">
              <li>Information you provide to us: such as name, email address, and payment information.</li>
              <li>Information we collect automatically: such as IP address, browser type, and interaction with the Services.</li>
            </ul>
            <p className="mb-4">We may also collect information from third-party sources, such as social media platforms, to supplement the data we collect directly from you.</p>
            <h3 className="text-xl font-semibold mb-2">4. How We Use Your Personal Data</h3>
            <p className="mb-4">We use your Personal Data to provide and improve our Services, process payments, communicate with you, and comply with legal obligations.</p>
            <p className="mb-4">Your personal data is essential to our ability to offer you personalized and efficient services. We may also use your data for marketing purposes, with your consent, to provide you with information about our products and services that may be of interest to you.</p>
            <h3 className="text-xl font-semibold mb-2">5. How We Disclose And Transfer Your Personal Data</h3>
            <p className="mb-4">We may disclose your Personal Data to third parties such as service providers and partners who assist us in providing our Services. We do not sell your Personal Data.</p>
            <p className="mb-4">In certain circumstances, we may be required to disclose your personal data to comply with legal obligations, such as responding to lawful requests from public authorities or to protect our rights and interests.</p>
            <h3 className="text-xl font-semibold mb-2">6. How We Store Your Personal Data</h3>
            <p className="mb-4">We store Personal Data securely and take reasonable steps to protect it from loss, misuse, and unauthorized access. However, no system is completely secure.</p>
            <p className="mb-4">We use a variety of security measures, including encryption and access controls, to protect your personal data. Our data retention policies ensure that your data is kept only as long as necessary for the purposes for which it was collected.</p>
            <h3 className="text-xl font-semibold mb-2">7. Your Choices</h3>
            <p className="mb-4">You have several choices regarding your Personal Data, including accessing, updating, or deleting it. You can manage your preferences through your account settings.</p>
            <p className="mb-4">If you have any questions or concerns about your personal data or wish to exercise your rights, please contact us using the contact information provided below.</p>
            <h3 className="text-xl font-semibold mb-2">8. Children's Privacy</h3>
            <p className="mb-4">Our Services are not intended for children under 13. We do not knowingly collect Personal Data from children under 13.</p>
            <p className="mb-4">If we become aware that we have inadvertently collected personal data from a child under the age of 13, we will take steps to delete the data as soon as possible.</p>
            <h3 className="text-xl font-semibold mb-2">9. Changes To This Privacy Policy</h3>
            <p className="mb-4">We may update this Privacy Policy from time to time. We will notify you of any changes by updating the date at the top of this page and, in some cases, we may provide additional notice.</p>
            <p className="mb-4">We encourage you to review this Privacy Policy regularly to stay informed about how we are protecting your personal data. Your continued use of our services constitutes your acceptance of any changes to this policy.</p>
            <h3 className="text-xl font-semibold mb-2">10. Contact Us</h3>
            <p className="mb-4">If you have any questions or concerns about this Privacy Policy, please contact us at banatcomsolutions@gmail.com.</p>
          </div>
        );
      case 'cookies':
        return (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Cookie Statement</h2>
            <p className="mb-4">Banatcom uses cookies and similar technologies to provide, protect, and improve our Services. This statement explains how and why we use these technologies and the choices you have.</p>
            <h3 className="text-xl font-semibold mb-2">What are cookies?</h3>
            <p className="mb-4">Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies set by the website owner (in this case, Banatcom) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies."</p>
            <p className="mb-4">Cookies can serve many purposes, including remembering your preferences, enabling certain functionalities, and providing insights into how the website is being used. They can also be used for marketing and advertising purposes.</p>
            <h3 className="text-xl font-semibold mb-2">Why do we use cookies?</h3>
            <p className="mb-4">We use cookies for several reasons, including to ensure our Services operate properly, to enhance your experience, to analyze usage, and to provide personalized advertising.</p>
            <p className="mb-4">By using cookies, we can gather valuable information about your interactions with our website and tailor our services to better meet your needs. Cookies help us deliver a more personalized and efficient user experience.</p>
            <h3 className="text-xl font-semibold mb-2">Types of cookies we use</h3>
            <p className="mb-4">We use both session cookies (which expire once you close your web browser) and persistent cookies (which stay on your device for a set period or until you delete them).</p>
            <ul className="list-disc pl-5 mb-4">
              <li>Essential cookies: necessary for the operation of our Services.</li>
              <li>Functionality cookies: enhance the performance and functionality of our Services.</li>
              <li>Analytics cookies: help us understand how our Services are being used and how effective our marketing campaigns are.</li>
              <li>Advertising cookies: make advertising messages more relevant to you.</li>
            </ul>
            <p className="mb-4">We also use similar technologies, such as web beacons and tracking pixels, to collect information about your usage of our services and to measure the effectiveness of our marketing efforts.</p>
            <h3 className="text-xl font-semibold mb-2">Cookie management</h3>
            <p className="mb-4">You can manage your cookie preferences through your browser settings or by using our cookie management tool available in the footer of our website.</p>
            <p className="mb-4">Most web browsers allow you to control cookies through their settings. You can set your browser to notify you when you receive a cookie, or to refuse cookies altogether. Please note that if you choose to disable cookies, some features of our website may not function properly.</p>
            <h3 className="text-xl font-semibold mb-2">Changes to this Cookie Statement</h3>
            <p className="mb-4">We may update this Cookie Statement from time to time. We will notify you of any changes by updating the date at the top of this page.</p>
            <p className="mb-4">We encourage you to review this Cookie Statement regularly to stay informed about our use of cookies and related technologies. Your continued use of our services constitutes your acceptance of any changes to this statement.</p>
            <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
            <p className="mb-4">If you have any questions or concerns about our use of cookies, please contact us at banatcomsolutions@gmail.com.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D1D1C1] to-[#073B4C] flex flex-col items-center py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-white mb-8">Legal Terms</h1>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 flex flex-wrap justify-center">
          {Object.entries(sections).map(([key, title]) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`mx-2 my-1 px-4 py-2 rounded-lg font-semibold focus:outline-none ${activeSection === key ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                }`}
            >
              {title}
            </button>
          ))}
        </div>
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="w-full max-w-4xl mx-auto"
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default LegalTerms;
