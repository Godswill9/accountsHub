import { Link, useLocation } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ErrorPage = () => {
//   const history = useHistory();
  const location = useLocation();
  const errorMessage = new URLSearchParams(location.search).get("errorMessage");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-semibold text-red-600 mb-4">Something Went Wrong</h1>
          <p className="text-lg text-gray-600 mb-6">
            We encountered an issue while processing your request. Please try again later.
          </p>

          {/* Optional: Display error message if provided in the query */}
          {errorMessage && (
            <div className="bg-red-100 text-red-600 rounded-lg p-4 mb-6">
              <h2 className="font-semibold">Error Details</h2>
              <p>{errorMessage}</p>
            </div>
          )}

         <Link
                    to="/wallet"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
                      {" "}
                      Go to My Wallet
                    </button>
                  </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ErrorPage;
