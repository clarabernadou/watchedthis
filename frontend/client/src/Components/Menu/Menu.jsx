import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import './menu.css';

import { resetUserInfo } from '../../redux/reducers/userReducer';
import isThemeActive from '../../Themes/isThemeActive';

import axiosInstance from '../../ApiRequests/axios-config';

export default function Menu() {
    const buttonColor = useSelector((state) => state.event.colorBtn);

    const [image, setImage] = useState('');
    const [username, setUsername] = useState('');

    const userID = Cookies.get('user_id');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    function deleteCookie(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get(`/api/auth/${userID}`);
                const userData = response.data;

                setImage(userData.profilePicture ? `/images/${userData.profilePicture}` : '');
                setUsername(userData.username)

            } catch (error) {
                console.error('Erreur lors de la récupération des données de l\'utilisateur :', error);
            }
        };
        fetchUserData();
    }, [userID]);

    const handleLogout = async () => {
        try {
            const response = await axiosInstance.post('/api/auth/logout');
            const logoutData = response.data;
            console.log(logoutData);

            dispatch(resetUserInfo());

            deleteCookie('userInfoCookie');
            deleteCookie('authentication_token');
            deleteCookie('user_id');

            sessionStorage.removeItem("films");

            navigate('/login');
        } catch (error) {
            console.log('Error with logout:', error);
        }
    };

    return (
        <div className='menuContainer'>
            <img src={image} className='userIcon verticalMenuUserIcon' alt="User Icon" />
            <h3>Hello {username} !</h3>
            <Link className='linkMenu' to='/profile'>Profile</Link>
            <hr className='insideBtnLine tagLine'></hr>
            <Link className='linkMenu' to='/films'>Home</Link>
            <hr className='insideBtnLine tagLine'></hr>
            <Link className='linkMenu' to='/my-watchlist'>Watchlist</Link>
            <hr className='insideBtnLine tagLine'></hr>
            <Link className='linkMenu' to='/my-already-watched'>Already watched</Link>
            <button className={`button menuBtn ${buttonColor}`} onClick={handleLogout}>Logout</button>
        </div>
    );
}
