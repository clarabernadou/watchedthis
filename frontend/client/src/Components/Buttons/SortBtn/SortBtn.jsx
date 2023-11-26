import React, { useState } from 'react';
import '../buttons.css';
import './sortBtn.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';


import { useDispatch } from "react-redux";
import { setSortValue } from '../../../redux/reducers/sortReducer';

export default function SortBtn({ options, className }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(options[0]);

    const toggleSelect = () => {
        setIsOpen(!isOpen);
    };

    const dispatch = useDispatch();
    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        dispatch(setSortValue(option));
    };

    return (
        <div className='sortBtnContainer'>
            <button className={`sortBtn ${className} ${isOpen ? 'open' : ''}`} onClick={toggleSelect}>
                <div className='buttonInfo'>
                    {selectedOption}
                    <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />                    
                </div>
            </button>
            {isOpen && (
                <div className={`insideBtn insideSortBtn ${className} ${isOpen ? 'open' : ''}`}>
                    <hr className='insideBtnLine'></hr>
                    {options.map((option) => (
                        <div
                            key={option}
                            onClick={() => handleOptionSelect(option)}
                            className={`option sortBtnOption ${option === selectedOption ? 'active' : ''}`}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
