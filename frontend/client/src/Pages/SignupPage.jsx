import React from 'react';
import { useSelector } from 'react-redux';
import './signupPage.css'

import Logo from '../assets/signinLoginLogo.svg'
import PinkOctoberLogo from '../assets/signinLoginLogoPO.svg'
import HalloweenLogo from '../assets/signinLoginLogoHLW.svg'

import SignupForm from "../Components/Form/SignupForm";
import { useTheme } from '../utils/theme';

export default function SignupPage() {
    const buttonColor = useSelector((state) => state.event.colorBtn);
    const eventName = useSelector((state) => state.event.eventName);
    useTheme();
   
    return (
        <div className="signinPageContainer">
            {eventName === 'Halloween' ? (
                <img src={HalloweenLogo} className='signupLogo' alt="Halloween logo" />
            ) : eventName === 'PinkOctober' ? (
                <img src={PinkOctoberLogo} className='signupLogo' alt="Pink October logo" />
            ) : (
                <img src={Logo} className='signupLogo' alt="Watched This logo" />
            )}

            <SignupForm className={buttonColor} />
        </div>
    );
}
