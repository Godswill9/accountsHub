import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authService } from "@/services/authService";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBanned, setIsBanned] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await authService.verifyUser();

        if (response?.message === "Please log in again.") {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);

          if (response?.acc_status && response.acc_status !== "Okay") {
            setIsBanned(true);
          }
        }
      } catch (error) {
        console.error("Authentication error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (isLoading) return null; // or a spinner if preferred

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isBanned) return <Navigate to="/banned" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
