import React from 'react';
import { useSelector } from 'react-redux';
import './tag.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { useDispatch } from "react-redux";
import { setSelectTagsValue } from '../../redux/reducers/selectTagsReducer'

export default function Tag({ name, id, pageFilm }) {
    const tags = useSelector((state) => state.selectTags.selectTagsValue);
    
    const dispatch = useDispatch();
    const removeTag = () => {
        const index = tags.findIndex((tag) => tag.id === id);
        const newTags = [...tags];
        newTags.splice(index, 1);
        dispatch(setSelectTagsValue(newTags));
    }

    return (
        <div className='tag genreTag'>
            <p className='strong' key={id}>{name}</p>
            {pageFilm ? null : (
                <FontAwesomeIcon icon={faTimes} className='removeTagIcon' onClick={removeTag}/>
            )}
        </div>
    );
}
