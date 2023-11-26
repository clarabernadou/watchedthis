import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setFilmPage } from '../redux/reducers/filmPageReducer';
import axiosInstance from './axios-config';

const ApiFilm = ({ id }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFilmData = async () => {
      try {
        const response = await axiosInstance.get(`/api/films/${id}`);
        const filmData = response.data;
        dispatch(setFilmPage(filmData));
      } catch (error) {
        console.log('Error while fetching film data:', error);
      }
    };

    fetchFilmData();
  }, [dispatch, id]);

  return null;
};

export default ApiFilm;
