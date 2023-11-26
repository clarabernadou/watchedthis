import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './searchBar.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { useDispatch } from "react-redux";
import { setSearchValue } from '../../redux/reducers/searchReducer';

export default function SearchBar() {
    const [isSearchBarVisible, setSearchBarVisible] = useState(false);
    const [search, setSearch] = useState('');
    const searchBarRef = useRef(null);

    const toggleSearchBar = () => {
        setSearchBarVisible(!isSearchBarVisible);
    };

    const dispatch = useDispatch();

    const handleSearchInputChange = (event) => {
        const searchTerm = event.target.value;
        setSearch(searchTerm);
        dispatch(setSearchValue(searchTerm));
    };

    useEffect(() => {
        const handleEscKeyPress = (event) => {
            if (event.key === 'Escape') {
                toggleSearchBar();
            }
        };

        const handleDocumentClick = (event) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
                setSearchBarVisible(false);
            }
        };

        if (isSearchBarVisible) {
            document.addEventListener('keydown', handleEscKeyPress);
            document.addEventListener('click', handleDocumentClick);
        }

        return () => {
            document.removeEventListener('keydown', handleEscKeyPress);
            document.removeEventListener('click', handleDocumentClick);
        };
    }, [isSearchBarVisible]);

    return (
        <div className={`searchBar ${isSearchBarVisible ? 'open' : ''}`} ref={searchBarRef}>
            <div className="searchBarInner">
                <Link to='/films'>
                    <FontAwesomeIcon icon={faSearch} className="icon" onClick={toggleSearchBar} />
                </Link>
                {isSearchBarVisible && (
                    <input
                        className='searchBarInput'
                        type="text"
                        placeholder="Search for a film name..."
                        value={search}
                        onChange={handleSearchInputChange}
                    />
                )}
            </div>
        </div>
    );
}
