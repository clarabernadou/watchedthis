import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setFilmGenres } from '../redux/reducers/filmGenresReducer'

const apiKey = process.env.REACT_APP_TMDB_API_KEY;

const ApiFilmGenreList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFilmGenres = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-EN`);

        if (!response.ok) {
          throw new Error('Request failed');
        }

        const data = await response.json();
        dispatch(setFilmGenres(data.genres));
      } catch (error) {
        console.error('Error retrieving list of genres:', error);
      }
    };

    fetchFilmGenres();
  }, [dispatch]);

  return null;
};

export default ApiFilmGenreList;
