import React from 'react';
import Cookies from "js-cookie";

import './profilePage.css'

import Header from '../Components/Header/Header';
import ProfileForm from '../Components/Form/ProfileForm';
import Footer from "../Components/Footer/Footer";
import CountdownRedirect from "../Components/CountdownRedirect/CountdownRedirect";
import { useTheme } from '../utils/theme';

export default function ProfilePage() {
    const authenticationToken = Cookies.get("authentication_token")
    useTheme();
    return (
        <div>
            <Header />
            <div className='profileFormContainer'>
                <ProfileForm />
            </div>
            <Footer />
            
            {authenticationToken ? null : <CountdownRedirect whereRedirect='/login' />}
        </div>
    );
}