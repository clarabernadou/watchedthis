import React from "react";
import { useSelector } from 'react-redux'
import Cookies from "js-cookie";

import Header from '../Components/Header/Header';
import Footer from "../Components/Footer/Footer";
import CountdownRedirect from "../Components/CountdownRedirect/CountdownRedirect";

import ApiFilmList from '../ApiRequests/ApiFilmList'
import WatchlistTable from "../Components/Tables/WatchlistTable/WatchlistTable";
import { useTheme } from "../utils/theme";
import ApiFilmStatus from "../ApiRequests/ApiFilmStatus";

export default function WatchlistPage() {
    const authenticationToken = Cookies.get("authentication_token")
    const userId = Cookies.get('user_id');
    const films = useSelector((state) => state.film.films);

    useTheme();
    return (
        <div>
            <Header />
            <WatchlistTable />
            <Footer />

            { authenticationToken ? null : <CountdownRedirect whereRedirect='/login' /> }
            <ApiFilmList />
            <ApiFilmStatus userId={userId} films={films} />
        </div>
    );
}