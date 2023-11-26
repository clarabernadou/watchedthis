import React from 'react';
import './footer.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
    return (
        <div className='footerContainer'>
            <div className='contact'>
                <span className='contactText'>
                    <FontAwesomeIcon icon={faMapMarkerAlt} className='faIcon' />
                    <p>Morbihan, Bretagne</p>
                </span>
                <span className='contactText'>
                    <FontAwesomeIcon icon={faEnvelope} className='faIcon' />
                    <a href="mailto:bernadouclara@icloud.com" className="link">bernadouclara@icloud.com</a>
                </span>
                <span className='contactText'>
                    <FontAwesomeIcon icon={faGithub} className='faIcon' />
                    <a href='https://github.com/clarabernadou' className="link">/clarabernadou</a>
                </span>
                <span className='contactText'>
                    <FontAwesomeIcon icon={faLinkedinIn} className='faIcon' />
                    <a href='https://www.linkedin.com/in/clarabernadou/' className="link">/in/clarabernadou</a>
                </span>                
            </div>
            <p className='copyright'>September 2023 © Clara Bernadou</p>
        </div>
    );
}
