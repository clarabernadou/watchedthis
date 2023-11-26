import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './filmList.css';

import Loader from '../Loader/Loader';
import getFilmListLogic from '../FilmLogic/getFilmListLogic'

import { setFilteredFilms } from '../../redux/reducers/filmReducer';
import { useDispatch } from 'react-redux';
import ScrollToTopBtn from '../Buttons/ScrollToTopBtn/ScrollToTopBtn';


export default function FilmList({ logicOption }) {
    const { loading } = getFilmListLogic(logicOption);
    const filteredFilms = useSelector((state) => state.film.filteredFilms);
    const dispatch = useDispatch()

    useEffect(() => {
        if (filteredFilms) {
            dispatch(setFilteredFilms(filteredFilms))
        }
    }, [dispatch, filteredFilms]);


    if (loading) {
        return <Loader />;
    }

    if (filteredFilms && filteredFilms.length === 0) {
        return (
            <div className="noFilmFound">
                <p>No films were found</p>
            </div>
        );
    }    

    return (
        <div className="filmListContainer">
            <ul className="filmList">
                {filteredFilms.map((film) => (
                    <li key={film.id} className="filmPoster">
                        <Link to={`/film/${film.id}`}>
                            <img className="filmImg" src={`https://image.tmdb.org/t/p/w500${film.poster_path}`} alt={film.title} />
                        </Link>
                        <h3>{film.title}</h3>
                    </li>
                ))}
            </ul>
            <ScrollToTopBtn />
        </div>
    );
}