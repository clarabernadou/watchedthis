import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axiosInstance from './axios-config';

const UpdateDatabase = ({ filmId, newData }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const updateDatabase = async () => {
      try {
        const response = await axiosInstance.put(
          `/api/films/update/${filmId}`,
          newData,
          { headers: { 'Content-Type': 'application/json' } }
        );

        console.log("Update response: " + response);

        if (response.status === 200) {
          const filmData = response.data;
          console.log('Successful update:', filmData);
        } else {
          console.error('Update request failed.');
        }
      } catch (error) {
        console.error('Update error:', error);
      }
    };

    updateDatabase();
  }, [dispatch, filmId, newData]);

  return null;
};

export default UpdateDatabase;
