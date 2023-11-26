import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './scrollToTopBtn.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

export default function ScrollToTopBtn() {
  const buttonColor = useSelector((state) => state.event.colorBtn);

  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (window.pageYOffset > 1000) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      {isVisible && (
        <button className={`button scrollToTopBtn ${buttonColor}`} onClick={scrollToTop}>
          <FontAwesomeIcon icon={faArrowUp} className='scrollToTopIcon' />
        </button>
      )}
    </div>
  );
}
