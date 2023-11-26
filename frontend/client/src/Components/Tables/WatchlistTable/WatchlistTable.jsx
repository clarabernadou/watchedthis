import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import Cookies from "js-cookie";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faTv } from "@fortawesome/free-solid-svg-icons";

import axiosInstance from "../../../ApiRequests/axios-config";
import '../table.css';
import ScrollToTopBtn from "../../Buttons/ScrollToTopBtn/ScrollToTopBtn";

export default function WatchlistTable() {
    const [filmsData, setFilmsData] = useState([]);
    const [inWatchlist, setInWatchlist] = useState(true);
    const [isWatched, setIsWatched] = useState(false);
    const [buttonClass, setButtonClass] = useState('buttonsColor');

    const userId = Cookies.get('user_id');
    const films = useSelector((state) => state.film.films);

    useEffect(() => {
        const fetchFilmData = async () => {
            try {
                const filmDataPromises = films.map(async (film) => {
                    const response = await axiosInstance.get(`/api/films/auth/${userId}/film/${film.id}/status`);
                    return {
                        id: film.id,
                        img: `https://image.tmdb.org/t/p/w500${film.poster_path}`,
                        title: film.title,
                        overview: film.overview,
                        toWatch: response.data.toWatch
                    };
                });
    
                const filmDataList = await Promise.all(filmDataPromises);
                const toWatchFilms = filmDataList.filter((film) => film.toWatch === true);
                setFilmsData(toWatchFilms);
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchFilmData();
    }, [userId, films]);

    const watchedIt = async (id) => {
        try {
            const response = await axiosInstance.post(`/api/films/auth/${userId}/film/${id}/add-to-already-watched`);
            setIsWatched(true);
            console.log(response.data.message);
        } catch (error) {
            console.error(error);
        }
    };

    const removeToWatchlist = async (id) => {
        try {
            const response = await axiosInstance.post(`/api/films/auth/${userId}/film/${id}/add-to-watchlist`);
            setInWatchlist(false);
            console.log(response.data.message);
        } catch (error) {
            console.error(error);
        }
    };

    if (filmsData && filmsData.length === 0) {
        return (
            <div className="noFilmFound">
                <p>You have no films to watch</p>
            </div>
        );
    }

    return (
        <div className="ListTableContainer">
            <h1>Films to watch</h1>
            <table>
                <thead>
                    <tr>
                        <th className="table-header">Poster</th>
                        <th className="table-header">Title</th>
                        <th className="table-header">Overview</th>
                        <th className="table-header">Watched</th>
                        <th className="table-header">Remove </th>
                    </tr>
                </thead>
                <tbody>
                    {filmsData.map((film, index) => (
                        <tr key={index}>
                            <td className="table-cell">
                                <Link to={`/film/${film.id}`}>
                                    <img className='table-img' src={film.img} alt={film.title} />
                                </Link>
                            </td>
                            <td className="table-cell">
                                <Link to={`/film/${film.id}`}>
                                    {film.title}
                                </Link>
                            </td>
                            <td className="table-cell">{film.overview}</td>
                            <td className="table-cell">
                                <p className='link removeLink' onClick={() => { watchedIt(film.id); removeToWatchlist(film.id) }}>
                                    <FontAwesomeIcon icon={faTv} /> I watched it
                                </p>
                            </td>
                            <td className="table-cell">
                                <p className='link removeLink' onClick={() => { removeToWatchlist(film.id) }}>
                                    <FontAwesomeIcon icon={faTrashCan} /> Remove
                                </p>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ScrollToTopBtn />
        </div>
    );
}