import React from "react";
import "./inputField.css"

export default function InputField({ placeholder, type, value, onChange, error }) {
    return (
        <div className="inputField">
            <input
                placeholder={placeholder}
                type={type}
                value={value}
                onChange={onChange}
            />
            {error && <p className="error">{error}</p>}
        </div>
    )
}