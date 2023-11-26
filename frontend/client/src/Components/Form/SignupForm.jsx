import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from "axios";
import "./signupForm.css";
import InputField from "../InputField/InputField";
import ValidationModal from "../Modal/ValidationModal/ValidationModal";

export default function SignupForm({ className }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    const handleChange = (field) => {
        setErrors({ ...errors, [field]: undefined });
    };

    const openModal = () => {
        setIsModalOpen(true);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!username.trim()) {
            newErrors.username = "Username is required";
        }

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!isValidEmail(email)) {
            newErrors.email = "Invalid email format";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
        }

        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await axios.post("http://localhost:8080/api/auth/signup", { username, email, password });
                console.log("Server response :", response.data);
                openModal();
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    const responseMessage = error.response.data.message.toLowerCase();
                    if (responseMessage.includes("email")) {
                        setErrors({ ...newErrors, common: "You already have an account" });
                    } else if (responseMessage.includes("username")) {
                        setErrors({ ...newErrors, common: "This username is already taken" });
                    } else {
                        console.error("Form submission error :", error);
                    }
                } else if (error.response && error.response.status === 404) {
                    const responseMessage = error.response.data.message.toLowerCase();
                    console.log(responseMessage)
                    if(responseMessage.includes("User Not found)")){
                        setErrors({ ...newErrors, common: "This account has not been validated or does not exist" });
                    } else {
                        console.error("Form submission error :", error);
                    }
                }
            }
        } else {
        setErrors(newErrors);
        }
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <div className="signupFormContainer">
            <form onSubmit={handleSubmit}>
                <h2>Create account</h2>
                <div className="formInputs">
                    <InputField
                        placeholder="Username"
                        type="text"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value.toLowerCase());
                            handleChange("username");
                        }}
                    />
                    {errors.username && <p className="error">{errors.username}</p>}
                    <InputField
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value.toLowerCase());
                            handleChange("email");
                        }}
                    />
                    {errors.email && <p className="error">{errors.email}</p>}
                    <InputField
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            handleChange("password");
                        }}
                    />
                    {errors.password && <p className="error">{errors.password}</p>}
                </div>
                {errors.common && <p className="error">{errors.common}</p>}
                <div className="signupLoginDiv">
                    <Link className='link signupLoginLink' to='/login'>Already have an account ?</Link>
                </div>
                <button className={`button ${className} signupLoginBtn`} type="submit">Signup</button>
            </form>
            {isModalOpen && <ValidationModal />}
        </div>
    );
}
