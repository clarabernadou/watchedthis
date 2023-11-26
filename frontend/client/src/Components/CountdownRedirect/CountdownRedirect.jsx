import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";

const CountdownRedirect = ({ whereRedirect }) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(0.5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      if (!sessionStorage.getItem('accessToken')) {
        navigate(whereRedirect);
      }      
    }
  }, [navigate, countdown, whereRedirect]);

  return (
    <div className="countdownContainer">
        <Loader />
    </div>
  );
};

export default CountdownRedirect;