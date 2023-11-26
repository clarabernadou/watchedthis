import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import axiosInstance from '../../ApiRequests/axios-config';
import Cookies from 'js-cookie';
import './film.css';

import Dropdown from '../Dropdown/Dropdown';
import Rating from '../Rating/Rating';
import Tag from '../Tag/Tag';

import { getLanguageList } from '../../Languages/FilmLanguages';
import isThemeActive from '../../Themes/isThemeActive';
import { setFilmPage } from '../../redux/reducers/filmPageReducer';

export default function Film({ id }) {
    const selectedFilm = useSelector((state) => state.filmPage.filmPage);
    const storedFilmGenres = JSON.parse(sessionStorage.getItem('filmGenres')) || [];
    const buttonColor = useSelector((state) => state.event.colorBtn);


    const [isRendered, setIsRendered] = useState(false);
    const [isAddedToWatchlist, setIsAddedToWatchlist] = useState(false);
    const [isAlreadyWatched, setIsAlreadyWatched] = useState(false);

    const languages = getLanguageList();
    const filmLanguage = languages.find((lang) => lang.code === selectedFilm.original_language);

    const formatReleaseDate = (releaseDate) => {
        const dateObject = new Date(releaseDate);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return dateObject.toLocaleString('en-US', options);
    }    
          
    useEffect(() => {
        if (!isRendered) {
            setIsRendered(true);
        }
    }, [isRendered]);

    const matchingGenres = storedFilmGenres.filter((genre) =>
        selectedFilm.genre_ids.includes(genre.id)
    );

    const userId = Cookies.get('user_id');

    useEffect(() => {
        const getFilmStatus = async () => {
            try {
                const response = await axiosInstance.get(`/api/films/auth/${userId}/film/${id}/status`);
                setIsAddedToWatchlist(response.data.toWatch)
                setIsAlreadyWatched(response.data.alreadyWatched);
            } catch (error) {
                console.error(error);
            }
        };

        getFilmStatus();
    }, [userId, id]);

    const addToWatchlist = async () => {
        try {
            const response = await axiosInstance.post(`/api/films/auth/${userId}/film/${id}/add-to-watchlist`);
            setIsAddedToWatchlist(!isAddedToWatchlist);
            console.log(response.data.message);
        } catch (error) {
            console.error(error);
        }
    };
      
    const alreadyWatched = async () => {
        try {
            const response = await axiosInstance.post(`/api/films/auth/${userId}/film/${id}/add-to-already-watched`);
            setIsAlreadyWatched(!isAlreadyWatched);
            console.log(response.data.message);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='filmContainer'>
            <img
                className='filmImg sizeFilmImg'
                src={`https://image.tmdb.org/t/p/w500${selectedFilm.poster_path}`}
                alt={selectedFilm.title}
            />
            <div className='filmInfosContainer'>
                <div className='tagList'>
                    {matchingGenres.map((genre) => (
                        <Tag key={genre.id} name={genre.name} id={genre.id} pageFilm={true} />
                    ))}
                </div>
                <div>
                    <h1 className='filmTitle'>{selectedFilm.title}</h1>
                    <p>
                        Released on <span className='strong'>{formatReleaseDate(selectedFilm.release_date)}</span>
                    </p>
                    <p>
                        The original language is <span className='strong'>{filmLanguage && filmLanguage.enName}</span>
                    </p>
                    <p>
                        {selectedFilm.adult ? `This film is for adults` : 'This film is for all ages'}
                    </p>
                    <div className='notationStars'>
                        <Rating id={id} />
                    </div>
                </div>
                <div className='watchlistBtnContainer'>
                    <button className={`button ${buttonColor}`} onClick={addToWatchlist}>
                        {isAddedToWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                    </button>
                    <button className={`button ${buttonColor}`} onClick={alreadyWatched}>
                        {isAlreadyWatched ? "Watched" : "Not Watched"}
                    </button>
                </div>
                <div className='filmDropdownContainer'>
                    <Dropdown>
                        <h3 className='dropdownTitle'>Overview</h3>
                        <p>{selectedFilm.overview}</p>
                    </Dropdown>
                </div>
            </div>
        </div>
    );
}