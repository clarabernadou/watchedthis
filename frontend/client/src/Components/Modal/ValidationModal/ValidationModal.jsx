import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './validationModal.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import ValidationEmail from '../../../assets/validationemail.png'

export default function ValidationModal() {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const navigate = useNavigate();

    const toggleModal = () => {
        setIsModalOpen(false);
        navigate('/login');
    };

    return (
      <div className="modalContainer">
        <div className="overlay" aria-hidden="true" tabIndex="-1">
            <FontAwesomeIcon icon={faXmark} className='closeMenu' onClick={toggleModal} />
            <div className="modal">
                <img src={ValidationEmail} alt="Validation email image"></img>
                <h2>Thank you for signing up !</h2>
                <p>Please check your email, validate your account, and gain access to our platform.</p>
            </div>
        </div>
      </div>
    );
  }