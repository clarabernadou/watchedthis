import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from "axios";
import Cookies from "js-cookie";

export default function WatchlistLogic() {
    const userId = Cookies.get('user_id');
    const films = useSelector((state) => state.film.films);

    const [filteredFilms, setFilteredFilms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWatchlistData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/films/auth/${userId}/save-films/`);
                const filmData = response.data;

                const watchlistFilms = filmData.filter((film) => film.toWatch === true && film.userId == userId);

                const filmsWithSameId = films.filter((film) =>
                    watchlistFilms.map((watchlistFilm) => watchlistFilm.filmId).includes(film.id)
                );

                setFilteredFilms(filmsWithSameId);
                setLoading(false);
            } catch (error) {
                console.log('Error while fetching film data:', error);
            }
        };

        fetchWatchlistData();
    }, [userId, films]);

    return { filteredFilms, loading };
}