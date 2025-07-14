import { AlertTriangle } from "lucide-react";

export default function BannedPage() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center text-center bg-red-50 text-red-800 px-4">
      {/* Logo */}
      <img
        src="https://accountshub.onrender.com/lovable-uploads/b8bc2363-f8b3-49a4-bec6-1490e3aa106a-removebg-preview.png"
        alt="AccountsHub Logo"
        className="h-24 mb-6"
      />

      {/* Alert Icon */}
      <AlertTriangle className="w-10 h-10 text-red-600 mb-4" />

      {/* Heading */}
      <h1 className="text-3xl font-bold mb-2">Account Banned</h1>

      {/* Message */}
      <p className="text-sm sm:text-base max-w-md">
        Your account has been permanently banned due to a violation of our platform rules.
        If you believe this was a mistake, please contact support for further review.
      </p>
    </div>
  );
}
