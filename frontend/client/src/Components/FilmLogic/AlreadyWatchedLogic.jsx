import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from "axios";
import Cookies from "js-cookie";

export default function AlreadyWatchedLogic() {
    const userId = Cookies.get('user_id');
    const films = useSelector((state) => state.film.films);

    const [filteredFilms, setFilteredFilms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlreadyWatchedData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/films/auth/${userId}/save-films/`);
                const filmData = response.data;

                const alreadyWatchedFilms = filmData.filter((film) => film.alreadyWatched === true && film.userId == userId);

                const filmsWithSameId = films.filter((film) =>
                    alreadyWatchedFilms.map((alreadyWatchedFilm) => alreadyWatchedFilm.filmId).includes(film.id)
                );

                setFilteredFilms(filmsWithSameId);
                setLoading(false);
            } catch (error) {
                console.log('Error while fetching film data:', error);
            }
        };

        fetchAlreadyWatchedData();
    }, [userId, films]);

    return { filteredFilms, loading };
}