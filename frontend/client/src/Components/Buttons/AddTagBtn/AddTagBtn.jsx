import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import '../buttons.css';
import './addTagBtn.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

import { useDispatch } from "react-redux";
import { setSelectTagsValue } from '../../../redux/reducers/selectTagsReducer'

export default function AddTagBtn({ options, className }) {
    const tags = useSelector((state) => state.selectTags.selectTagsValue);
    const [isOpen, setIsOpen] = useState(false);
    
    const toggleSelect = () => {
      setIsOpen(!isOpen);
    };
    
    const dispatch = useDispatch();
    
    const addTag = (option) => {
        const newTags = [...tags, option];
        setIsOpen(false);
        dispatch(setSelectTagsValue(newTags));
    };
    
    return (
        <div className='addTagContainer'>
            <button className={`addTagBtn  ${className} ${isOpen ? 'open' : ''}`} onClick={toggleSelect}>
                <div className='buttonInfo'>
                    Filter by tags
                    <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
                </div>
            </button>
            {isOpen && (
                <div className={`insideBtn insideTagBtn ${className} ${isOpen ? 'open' : ''}`}>
                    <hr className='insideBtnLine tagLine'></hr>
                    <div className='allTagOptions'>
                        {options.map((option) => (
                            <div
                                key={option.id}
                                onClick={() => addTag(option)}
                                className='option tagOption'
                            >
                                {option.name}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
