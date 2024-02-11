import React, { useEffect } from "react";
import api from "./components/utils/api";

const Welcome = () => {
  useEffect(() => {
    const fetchWelcome = async () => {
      try {
        await api.get("/");
      } catch (error) {
        console.log(error);
        // Handle error or redirect to login
      }
    };

    fetchWelcome();
  }, []);

  return (
    <div className="text-center flex justify-center items-center h-screen font-extrabold">
      Welcome to the application
    </div>
  );
};

export default Welcome;
