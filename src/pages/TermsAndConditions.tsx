import React, { useEffect } from "react";

const TermsAndConditions = () => {
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
          <h1 className="text-2xl font-bold text-flippa-navy">Terms & Conditions</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 space-y-10">
        <p className="text-sm text-gray-500">Last updated: July 19, 2025</p>

        {/* Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Agreement to Terms</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            By accessing or using the AccountsHub platform, you agree to be bound by these Terms and Conditions and all applicable laws and regulations.
            If you do not agree with any part of these terms, you are prohibited from using our services.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">2. Use License</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-2">
            We grant you a limited, non-exclusive, and non-transferable license to access and use AccountsHub for personal, non-commercial purposes only.
          </p>
          <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
            <li>Modifying or copying any materials</li>
            <li>Using materials for commercial or public display</li>
            <li>Reverse engineering any software on the site</li>
            <li>Removing any copyright or proprietary labels</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">3. Account Security</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            Notify us immediately of any unauthorized access or suspected breach.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">4. Prohibited Uses</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-2">
            You agree not to use AccountsHub for:
          </p>
          <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
            <li>Illegal or unauthorized purposes</li>
            <li>Violating laws or regulations</li>
            <li>Infringing on intellectual property rights</li>
            <li>Harassment, abuse, or discrimination</li>
            <li>Submitting false or misleading content</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">5. Payments and Refunds</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            All transactions are processed securely through trusted payment gateways.
            Refunds are handled in accordance with our Refund Policy and may be issued at our discretion.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">6. Limitation of Liability</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            AccountsHub shall not be liable for any indirect, incidental, or consequential damages arising from your use or inability to use the platform,
            including loss of data or business interruption.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">7. Governing Law</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            These terms are governed by the laws of the United States.
            You agree to submit to the exclusive jurisdiction of the applicable courts for any disputes.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">8. Modifications to Terms</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            AccountsHub reserves the right to update or modify these Terms at any time without prior notice.
            Continued use of the platform constitutes your acceptance of any changes.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            If you have any questions about these Terms and Conditions, please contact us at:
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

export default TermsAndConditions;
