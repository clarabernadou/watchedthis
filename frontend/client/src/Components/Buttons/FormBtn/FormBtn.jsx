import React from 'react';
import './formBtn.css'

export default function FormBtn({ name, className }) {
    return (
        <button className={`button ${className}`} type="submit">{name}</button>
    );
}
