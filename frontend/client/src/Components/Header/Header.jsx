import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import './header.css';

import Logo from '../../assets/logo.svg';
import HalloweenLogo from '../../assets/halloweenLogo.svg';
import PinkOctoberLogo from '../../assets/pinkOctoberLogo.svg';

import SearchBar from '../SearchBar/SearchBar';
import Menu from '../Menu/Menu';
import axiosInstance from '../../ApiRequests/axios-config';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [image, setImage] = useState('');

    const eventName = useSelector((state) => state.event.eventName);

    const userID = Cookies.get('user_id');

    const location = useLocation();
    const isHalloweenPage = location.pathname === '/event/halloween';

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get(`/api/auth/${userID}`);
                const userData = response.data;

                setImage(userData.profilePicture ? `/images/${userData.profilePicture}` : '');

            } catch (error) {
                console.error('Erreur lors de la récupération des données de l\'utilisateur :', error);
            }
        };

        fetchUserData();
    }, [userID]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className='headerContainer'>
            <div className='headerMainSection'>
                <Link to='/films'>
                    {eventName === 'Halloween' ? (
                        <img src={HalloweenLogo} className='headerLogo' alt="Halloween logo" />
                    ) : eventName === 'PinkOctober' ? (
                        <img src={PinkOctoberLogo} className='headerLogo' alt="Pink October logo" />
                    ) : (
                        <img src={Logo} className='headerLogo' alt="Watched This logo" />
                    )}
                </Link>
                <div className='searchAndEvent'>
                    {eventName === 'Halloween' ? (
                        <Link className={`eventLink  ${isHalloweenPage ? 'activeHalloweenLink' : 'link'}`} to='/event/halloween'>Halloween</Link>
                    ) : null}
                    <SearchBar />
                    <img src={image} className='userIcon' onClick={toggleMenu} alt="User Icon" />
                </div>
            </div>
            {isMenuOpen && 
                <div className="overlay" aria-hidden="true" tabIndex="-1" onClick={toggleMenu}>
                    <FontAwesomeIcon icon={faXmark} className='closeMenu' onClick={toggleMenu} />
                    <Menu />
                </div>
            }
            <hr />
        </div>
    );
}
