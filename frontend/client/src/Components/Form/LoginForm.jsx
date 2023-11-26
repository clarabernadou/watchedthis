import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import axios from "axios";

import { setUserInfo } from '../../redux/reducers/userReducer';
import Cookies from 'js-cookie';

import "./signupForm.css";

import InputField from "../InputField/InputField";

export default function LoginForm({ className }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (field, value) => {
        if (field === "username") {
            setUsername(value);
        } else if (field === "password") {
            setPassword(value);
        }
        setErrors({ ...errors, [field]: undefined });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!username.trim()) {
            newErrors.username = "Username is required";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
        }

        if (Object.keys(newErrors).length === 0) {
            try {
                setLoading(true);

                const response = await axios.post("http://localhost:8080/api/auth/signin", {
                    username: username,
                    password: password,
                });

                if (response.data.is_verified) {
                    if (response.data.authentication_token) {
                        // Dispatch user info to Redux
                        dispatch(setUserInfo(response.data));

                        const expirationDate = new Date();
                        expirationDate.setTime(expirationDate.getTime() + 24 * 60 * 60 * 1000);
                        
                        // Store the token in a cookie
                        Cookies.set("authentication_token", response.data.authentication_token, { expires: expirationDate });
                        Cookies.set("user_id", response.data.id);

                        // Redirect to the films page
                        navigate('/films');
                    } else {
                        newErrors.common = "Bad username or bad password";
                        setErrors(newErrors);
                    }
                } else {
                    newErrors.common = "Your account has not been verified or does not exist";
                    setErrors(newErrors);
                }
            } catch (error) {
                newErrors.common = "An error occurred while submitting the form.";
                console.error("Error while submitting the form:", error);
                setErrors(newErrors);
            } finally {
                setLoading(false);
            }
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div className="signupFormContainer">
            <form onSubmit={handleSubmit}>
                <h2>Login to your account</h2>
                <div className="formInputs">
                    <InputField
                        placeholder="Username"
                        type="text"
                        value={username}
                        onChange={(e) => handleChange("username", e.target.value.toLowerCase())}
                        error={errors.username}
                    />
                    <InputField
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        error={errors.password}
                    />
                </div>
                {errors.common && <p className="otherError error">{errors.common}</p>}
                <div className="signupLoginDiv">
                    <Link className="link signupLoginLink" to="/signup">
                        Don't have an account?
                    </Link>
                </div>
                <button
                    className={`button ${className} signupLoginBtn`}
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
