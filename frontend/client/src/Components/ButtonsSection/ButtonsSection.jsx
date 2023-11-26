import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './buttonsSection.css';

import SortBtn from '../Buttons/SortBtn/SortBtn';
import AddTagBtn from '../Buttons/AddTagBtn/AddTagBtn';

export default function SortBtnContainer() {
    const filmGenres = useSelector((state) => state.filmGenres.filmGenres);
    const films = useSelector((state) => state.film.filteredFilms);
    const buttonColor = useSelector((state) => state.event.colorBtn);

    const [filteredFilmGenres, setFilteredFilmGenres] = useState([]);
    const [buttonClass, setButtonClass] = useState('buttonsColor');

    useEffect(() => {
        let allFilmId = new Set();

        films.forEach((film) => {
            const genreIds = JSON.parse(film.genre_ids);
            genreIds.forEach((genreId) => {
                allFilmId.add(genreId);
            });
        });
        
        const updatedFilteredFilmGenres = filmGenres.filter((genre) => {
            return allFilmId.has(genre.id);
        });
        
        setFilteredFilmGenres(updatedFilteredFilmGenres);

    }, [films, filmGenres]);
    
    return (
        <div className='buttonsContainer'>
            <AddTagBtn options={filteredFilmGenres.map((genre) => genre)} className={buttonColor} />
            <SortBtn options={['Alphabetical order (a-z)', 'Anti-alphabetical order (z-a)', 'Release Date (earliest to latest)', 'Release Date (latest to earliest)']} className={buttonClass} />
        </div>
    );
}