import React from "react";
import Cookies from "js-cookie";

import { useParams } from 'react-router-dom';

import Header from '../Components/Header/Header';
import Film from '../Components/Film/Film';
import Footer from '../Components/Footer/Footer'
import CountdownRedirect from "../Components/CountdownRedirect/CountdownRedirect";

import ApiFilm from '../ApiRequests/ApiFilm';
import { useTheme } from "../utils/theme";

export default function FilmPage({}) {
    const { id } = useParams();
    useTheme();
    
    const storedFilms = sessionStorage.getItem('films');
    const films = storedFilms ? JSON.parse(storedFilms) : [];
    const authenticationToken = Cookies.get("authentication_token")

    return (
        <div className='filmPageContainer'>
            <Header />
            <Film id={id} films={films}/>
            <Footer />

            {authenticationToken ? null : <CountdownRedirect whereRedirect='/login' />}
            <ApiFilm id={id} />
        </div>
    );
}
