import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import "./profileForm.css";

import axiosInstance from '../../ApiRequests/axios-config';
import FormBtn from '../Buttons/FormBtn/FormBtn';

export default function ProfileForm() {
    const buttonColor = useSelector((state) => state.event.colorBtn);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        profilePicture: null,
    });
    const [imageUrl, setImageUrl] = useState('');
    const [errors, setErrors] = useState({});
    const userID = Cookies.get('user_id');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get(`/api/auth/${userID}`);
                const userData = response.data;

                setFormData({
                    username: userData.username,
                    email: userData.email,
                    profilePicture: userData.profilePicture,
                });

                if (userData.profilePicture) {
                    const imageUrl = `/images/${userData.profilePicture}`;
                    setImageUrl(imageUrl);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données de l\'utilisateur :', error);
            }
        };

        fetchUserData();
    }, [userID]);

    function isValidEmail(email) {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    }

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'profilePicture') {
            if (files.length > 0) {
                const file = files[0];
                const reader = new FileReader();

                reader.onload = (e) => {
                    setImageUrl(e.target.result);
                };

                reader.readAsDataURL(file);

                setFormData({
                    ...formData,
                    [name]: file,
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }

        setErrors({ ...errors, [name]: undefined });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('username', formData.username);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('profilePicture', formData.profilePicture);

        try {
            const response = await axiosInstance.put(`/api/auth/update/${userID}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("Server response :", response.data);

            if (response.status === 200) {
                console.log('Mise à jour du profil réussie');
            }
        } catch (error) {
            if (error.response && error.response.status === 500) {
                const responseMessage = error.response.data.message.toLowerCase();
                console.error(responseMessage)
                if (responseMessage.includes("email")) {
                    setErrors({ ...newErrors, email: "An account with this email already exists" });
                } else if (responseMessage.includes("username")) {
                    setErrors({ ...newErrors, username: "This username is already taken" });
                } else {
                    console.error("Form submission error:", error);
                }
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {imageUrl && (
                <div className='profilePictureSection'>
                    <img src={imageUrl} className='profilePicture' alt="Profile" />
                </div>
            )}
            <input
                type="text"
                name="username"
                value={formData.username.toLowerCase()}
                onChange={handleChange}
            />
            {errors.username && <span className="error">{errors.username}</span>}

            <input
                type="email"
                name="email"
                value={formData.email.toLowerCase()}
                onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}

            <input
                type="file"
                name="profilePicture"
                accept="image/*"
                onChange={handleChange}
                className='changeFileBtn'
            />
            <FormBtn className={buttonColor} name='Mettre à jour' />
        </form>
    );
}
