import React from 'react';import './loader.css'

export default function Loader() {
    return(
        <div className='loaderContainer'>
            <div className="overlay"  aria-hidden="true" tabIndex="-1"><span className="loader"></span></div>
        </div>
    )
}