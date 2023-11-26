import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setFilteredFilms } from '../../redux/reducers/filmReducer';

export default function HalloweenLogic() {
    const films = useSelector((state) => state.film.films);
    const filmGenres = useSelector((state) => state.filmGenres.filmGenres);
    const horrorGenre = filmGenres.find((genre) => genre.name === 'Horror');
    
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!horrorGenre) {
            setLoading(true);
            dispatch(setFilteredFilms([]));
        } else {
            const horrorFilms = films.filter((film) => film.genre_ids.includes(horrorGenre.id));
            dispatch(setFilteredFilms(horrorFilms));
            setLoading(false);
        }
    }, [films, horrorGenre]);

    return { loading };
}