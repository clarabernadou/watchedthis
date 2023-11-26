import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "./verificationPage.css"

import Validate from '../assets/validate.png'
import Error404 from '../assets/404.png'
import Error from '../assets/error.png'

const VerificationPage = () => {
  const [message, setMessage] = useState('');
  const { token } = useParams();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/auth/verify/${token}`);
        const tokenData = response.data;
  
        if (response.status === 200) {
          setMessage('Your account has been validated.');
        } else if (response.status === 404) {
          setMessage('Invalid or expired validation token.');
        } else {
          setMessage(tokenData.message);
        }
      } catch (error) {
        console.log('Error while fetching token data:', error);
        setMessage('An error occurred during account validation');
      }
    };
  
    fetchToken();
  }, [token]);

  return (
    <div className="verificationPageContainer">
      {message === 'Your account has been validated.' ? (
        <img src={Validate} alt="Validated account image" className="verificationMessageImg" />
      ) : message === 'Invalid or expired validation token.' ? (
        <img src={Error404} alt="Error 404 image" className="verificationMessageImg" />
      ) : <img src={Error} alt="Error image" className="verificationMessageImg" />}
      <p>{message}</p>
    </div>
  );
}  

export default VerificationPage;
