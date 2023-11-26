import React from "react";
import Cookies from "js-cookie";

import Header from '../../Components/Header/Header';
import ButtonsSection from "../../Components/ButtonsSection/ButtonsSection";
import TagsSection from "../../Components/TagsSection/TagsSection";
import FilmList from '../../Components/FilmList/FilmList';
import Footer from "../../Components/Footer/Footer";
import CountdownRedirect from "../../Components/CountdownRedirect/CountdownRedirect";

import ApiFilmList from '../../ApiRequests/ApiFilmList'
import ApiFilmGenreList from '../../ApiRequests/ApiFilmGenres';
import Bats from "./Bats/Bats";
import { useTheme } from "../../utils/theme";

export default function HalloweenPage() {
    const authenticationToken = Cookies.get("authentication_token")
    useTheme();

    return (
        <div className="halloweenPageContainer">
            {/* <Bats /> */}
            <Header />
            <ButtonsSection />
            <TagsSection />
            <FilmList logicOption="halloween" />
            <Footer />

            { authenticationToken ? null : <CountdownRedirect whereRedirect='/login' />}
            
            <ApiFilmGenreList />
            <ApiFilmList />
        </div>
    );
}
