import React, { useState } from "react";
import './dropdown.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

export default function Dropdown({ children }) {
    const [isBarOpen, setIsBarOpen] = useState(false);
    const toggleBar = () => {
        setIsBarOpen(!isBarOpen);
    };
    
    return (
        <div className={`dropdownContainer ${isBarOpen ? 'open' : ''}`}>
            <div className="dropdown" onClick={toggleBar}>
                {children[0]}
                {isBarOpen ? <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />}
            </div>
            {isBarOpen &&  <div className="dropdownOptions">{children[1]}</div>}
        </div>
    );
}
