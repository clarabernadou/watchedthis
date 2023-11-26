import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

import './signupPage.css'

import Logo from '../assets/signinLoginLogo.svg'
import PinkOctoberLogo from '../assets/signinLoginLogoPO.svg'
import HalloweenLogo from '../assets/signinLoginLogoHLW.svg'

import isThemeActive from '../Themes/isThemeActive';
import LoginForm from '../Components/Form/LoginForm';
import { useTheme } from '../utils/theme';

export default function SignupPage() {
    const buttonColor = useSelector((state) => state.event.colorBtn);
    const eventName = useSelector((state) => state.event.eventName);
    const userInfo = useSelector((state) => state.user.user);

    useTheme();

    useEffect(() => {
        if (userInfo) {
            const userInfoJSON = JSON.stringify(userInfo);
            Cookies.set('userInfoCookie', userInfoJSON);
            console.log(userInfoJSON);
        }
    }, [userInfo]);

    return (
        <div className="signinPageContainer">
            {eventName === 'Halloween' ? (
                <img src={HalloweenLogo} className='signupLogo' alt="Halloween logo" />
            ) : eventName === 'PinkOctober' ? (
                <img src={PinkOctoberLogo} className='signupLogo' alt="Pink October logo" />
            ) : (
                <img src={Logo} className='signupLogo' alt="Watched This logo" />
            )}

            <LoginForm className={buttonColor} />
        </div>
    );
}
