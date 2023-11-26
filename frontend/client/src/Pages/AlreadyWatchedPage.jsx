import React from "react";
import Cookies from "js-cookie";

import Header from '../Components/Header/Header';
import Footer from "../Components/Footer/Footer";
import CountdownRedirect from "../Components/CountdownRedirect/CountdownRedirect";

import ApiFilmList from '../ApiRequests/ApiFilmList';
import AlreadyWatchedTable from "../Components/Tables/AlreadyWatchedTable/AlreadyWatchedTable";
import { useTheme } from "../utils/theme";

export default function AlreadyWatchedPage() {
    useTheme();
    const authenticationToken = Cookies.get("authentication_token")
    return (
        <div>
            <Header />
            <AlreadyWatchedTable />
            <Footer />

            {authenticationToken ? null : <CountdownRedirect whereRedirect='/login' />}
            <ApiFilmList />
        </div>
    );
}
