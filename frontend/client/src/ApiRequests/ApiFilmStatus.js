import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setFilmsStatus } from '../redux/reducers/filmReducer';
import axiosInstance from './axios-config';
import { all } from "axios";

export default function ApiFilmStatus({ userId, films }) {
    const dispatch = useDispatch();

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
                        notation: response.data.notation,
                        alreadyWatched: response.data.alreadyWatched,
                        toWatch: response.data.toWatch,
                        comment: response.data.comment,
                        place: response.data.place,
                        with: response.data.with,
                    };
                });

                const allFilmData = await Promise.all(filmDataPromises);
                dispatch(setFilmsStatus(allFilmData))
            } catch (error) {
                console.error(error);
            }
        };

        fetchFilmData();
    }, [userId, films]);

    return null;
}