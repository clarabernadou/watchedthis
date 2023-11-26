import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setFilms } from '../redux/reducers/filmReducer';
import axiosInstance from './axios-config';

const ApiFilmList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFilmData = async () => {
      try {
        const response = await axiosInstance.get('/api/films');
        const filmData = response.data;
        dispatch(setFilms(filmData));
      } catch (error) {
        console.log('Error while fetching film data:', error);
      }
    };

    fetchFilmData();
  }, [dispatch]);

  return null;
};

export default ApiFilmList;
