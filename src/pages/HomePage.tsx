import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import UserHomePage from "./UserHomePage";
import GuestHomePage from "./GuestHomePage";

const HomePage: React.FC = () => {
  const { checkAuthStatus } = useAuth();
  const [status, setStatus] = useState(false);

  // useEffect(() => {
  //   const fetchAuthStatus = async () => {
  //     try {
  //       const response = await checkAuthStatus();
  //       if (response.message === "Please log in again.") {
  //         setStatus(false);
  //       } else {
  //         setStatus(true);
  //       }
  //     } catch (error) {
  //       console.error("Error in fetching auth status:", error);
  //       setStatus(false);
  //     }
  //   };

  //   fetchAuthStatus();
  // }, []);

  // return status ? <UserHomePage /> : <GuestHomePage />;
  return <UserHomePage />;
};

export default HomePage;
