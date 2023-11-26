import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './rating.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../ApiRequests/axios-config';

const Rating = ({ id }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);

  const userId = Cookies.get('user_id');

  useEffect(() => {
    const fetchNotationData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/films/auth/${userId}/film/${id}/status`);
        const notation = response.data;
        console.log(notation)

        if (notation && notation.notation) {
          setSelectedRating(notation.notation);
        }
      } catch (error) {
        console.error('Error while fetching film notation:', error);
      }
    };

    fetchNotationData();
  }, [id, userId]);

  const handleMouseOver = (star) => {
    setHoverRating(star);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = (star) => {
    if (selectedRating === star) {
      setSelectedRating(0);
      star = 0;
    } else {
      setSelectedRating(star);
    }

    axiosInstance.put(`/api/films/auth/${userId}/film/${id}/update/userFilm`, { notation: star})
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        console.error('Error while adding notation:', error);
      });  
  };

  return (
    <div>
      <h3 className='notationTitle'>Notation : {selectedRating || hoverRating} stars</h3>
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= (selectedRating || hoverRating) ? 'filled' : ''}`}
            onMouseOver={() => handleMouseOver(star)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(star)}
          >
            <FontAwesomeIcon icon={faStar} />
          </span>
        ))}
      </div>
    </div>
  );
};

export default Rating;