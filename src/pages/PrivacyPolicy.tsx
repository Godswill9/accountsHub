import React, { useEffect } from "react";

const PrivacyPolicy = () => {
      useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, []);
    
  return (
    <div className="bg-white text-gray-800">
      {/* Header */}
      <div className="border-b border-gray-200 py-6 px-6 md:px-12">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <img
            src="https://accountshub.onrender.com/lovable-uploads/b8bc2363-f8b3-49a4-bec6-1490e3aa106a-removebg-preview.png"
            alt="Accounts Hub Logo"
            className="w-10 h-10 object-contain"
          />
          <h1 className="text-2xl font-bold text-flippa-navy">Privacy Policy</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 space-y-10">
        <p className="text-sm text-gray-500">Last updated: July 19, 2025</p>

        {/* Sections */}
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
          <p className="text-sm text-gray-700 mb-2 leading-relaxed">
            We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include:
          </p>
          <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
            <li>Personal information (name, email address, phone number)</li>
            <li>Account credentials and profile information</li>
            <li>Payment information (processed securely through third-party providers)</li>
            <li>Communication data when you contact us</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices, updates, security alerts, and support messages</li>
            <li>Respond to your comments, questions, and customer service requests</li>
            <li>Communicate with you about products, services, and events</li>
            <li>Monitor and analyze trends, usage, and activities</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">3. Information Sharing and Disclosure</h2>
          <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
            <li>With your consent or at your direction</li>
            <li>With service providers who perform services on our behalf</li>
            <li>For legal reasons or to protect rights and safety</li>
            <li>In connection with a merger, acquisition, or sale of assets</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            However, no method of transmission over the internet is 100% secure.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">5. Cookies and Similar Technologies</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            We use cookies and similar tracking technologies to collect and track information about your use of our service and to improve your experience. You can control cookies through your browser settings.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">6. Your Rights and Choices</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-2">
            Depending on your location, you may have certain rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
            <li>Access and update your information</li>
            <li>Delete your account and information</li>
            <li>Object to processing of your information</li>
            <li>Request data portability</li>
            <li>Withdraw consent where applicable</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">7. Children's Privacy</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">8. International Data Transfers</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with applicable laws.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">9. Changes to This Privacy Policy</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <ul className="mt-2 text-sm text-gray-700 space-y-1 pl-4">
            <li>Email: support@accountshub.com</li>
            <li>Phone: +1 (234) 567-8901</li>
            <li>Address: AccountsHub, 123 Tech Avenue, NY, USA</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
