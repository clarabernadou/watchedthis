import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import Cookies from "js-cookie";
import '../table.css';

import axiosInstance from "../../../ApiRequests/axios-config";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import ScrollToTopBtn from "../../Buttons/ScrollToTopBtn/ScrollToTopBtn";

export default function AlreadyWatchedTable() {
    const [filmsData, setFilmsData] = useState([]);
    const [isAlreadyWatched, setIsAlreadyWatched] = useState(true);
    const [comment, setComment] = useState({}); 
    const [selectedPlace, setSelectedPlace] = useState({});
    const [openCommentInput, setOpenCommentInput] = useState({});
    const [openPlaceInput, setOpenPlaceInput] = useState({});


    const userId = Cookies.get('user_id');
    const films = useSelector((state) => state.film.films);

    useEffect(() => {
        const fetchFilmData = async () => {
            try {
                const filmDataPromises = films.map(async (film) => {
                    const response = await axiosInstance.get(`/api/films/auth/${userId}/film/${film.id}/status`);
                    return {
                        id: film.id,
                        img: `https://image.tmdb.org/t/p/w500${film.poster_path}`,
                        title: film.title,
                        notation: response.data.notation,
                        alreadyWatched: response.data.alreadyWatched,
                        comment: response.data.comment,
                        place: response.data.place,
                        with: response.data.with
                    };
                });
    
                const filmDataList = await Promise.all(filmDataPromises);
                const alreadyWatchedFilms = filmDataList.filter((film) => film.alreadyWatched === true);
                setFilmsData(alreadyWatchedFilms);
                
                const commentObj = {};
                const placeObj = {};
                alreadyWatchedFilms.forEach((film) => {
                    commentObj[film.id] = film.comment || "You haven't commented on this film";
                    placeObj[film.id] = film.place || "You haven't mentioned where you watched the film";
                });
                setComment(commentObj);
                setSelectedPlace(placeObj);
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchFilmData();
    }, [userId, films]);

    const updateComment = (id, newComment) => {
        setComment((prevComment) => ({
            ...prevComment,
            [id]: newComment,
        }));
    };

    const updatePlace = (id, newPlace) => {
        if (newPlace === "home") {
          newPlace = "Home";
        } else if (newPlace === "cinema") {
          newPlace = "Cinema";
        } else if (newPlace === "friends_family_home") {
          newPlace = "Friends/Family Home";
        } else if (newPlace === "other") {
          newPlace = "Other";
        }
      
        setSelectedPlace((prevPlace) => {
          return {
            ...prevPlace,
            [id]: newPlace,
          };
        });
    };      

    const saveAllChange = (filmId, newComment, newNotation, newPlace, newWithList) => {
        console.error(filmId, newComment, newNotation, newPlace, newWithList)
        axiosInstance
            .put(`/api/films/auth/${userId}/film/${filmId}/update/userFilm`, {
                comment: newComment === "You haven't commented on this film" ? null : newComment,
                notation: newNotation,
                place: newPlace  === "You haven't mentioned where you watched the film" ? null : newPlace,
                withList: newWithList
            })
            .then((response) => {
                console.log(response.data.message);
            })
            .catch((error) => {
                console.error('Error while updating userFilm:', error);
            });
    };    

    const removeToAlreadyWatched = async (id) => {
        try {
            const response = await axiosInstance.post(`/api/films/auth/${userId}/film/${id}/add-to-already-watched`);
            setIsAlreadyWatched(false);
            console.log(response.data.message);
        } catch (error) {
            console.error(error);
        }
    };

    const toggleOpenInput = (filmId, setOpenInput) => {
        setOpenInput((prevOpenInput) => ({
            ...prevOpenInput,
            [filmId]: !prevOpenInput[filmId],
        }));
    }
    
    return (
        <div className="ListTableContainer">
            <h1>Films already watched</h1>
            <table>
                <thead>
                    <tr>
                        <th className="table-header">Poster</th>
                        <th className="table-header">Title</th>
                        <th className="table-header">Rating</th>
                        <th className="table-header">Comment</th>
                        <th className="table-header">Where</th>
                        <th className="table-header">Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {filmsData.map((film, index) => (
                        <tr key={index}>
                            <td className="table-cell">
                                <Link to={`/film/${film.id}`}>
                                    <img className='table-img' src={film.img} alt={film.title}/>
                                </Link>
                            </td>
                            <td className="table-cell">
                                <Link to={`/film/${film.id}`}>
                                    {film.title}
                                </Link>
                            </td>
                            <td className="table-cell">{film.notation ? film.notation + '/5' : 'Unrated'}</td>
                            <td className="table-cell">
                                {openCommentInput[film.id] ? (
                                    <div>
                                        <textarea
                                            onChange={(e) => {
                                                updateComment(film.id, e.target.value);
                                            }}
                                            value={comment[film.id]}
                                        />                                    
                                        <button className="button" onClick={() => {
                                            saveAllChange(film.id, comment[film.id], film.notation, selectedPlace[film.id], film.with);
                                            toggleOpenInput(film.id, setOpenCommentInput);
                                        }}>Save</button>
                                    </div>
                                ) : (
                                    <div>
                                        {comment[film.id]}
                                        <button className="button" onClick={() => toggleOpenInput(film.id, setOpenCommentInput)}>Modify</button>
                                    </div>
                                )}
                            </td>
                            <td className="table-cell">
                                {openPlaceInput[film.id] ? (
                                    <div>
                                    <select
                                        value={selectedPlace[film.id]}
                                        onChange={(e) => {
                                        const newValue = e.target.value;
                                        updatePlace(film.id, newValue);
                                        saveAllChange(film.id, comment[film.id], film.notation, newValue, film.with);
                                        toggleOpenInput(film.id, setOpenPlaceInput);
                                        }}
                                    >
                                        <option value="cinema">Cinema</option>
                                        <option value="home">Home</option>
                                        <option value="friends_family_home">Friends/Family Home</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <button className="button" onClick={() => {
                                        toggleOpenInput(film.id, setOpenPlaceInput);
                                    }}>Cancel</button>
                                    </div>
                                ) : (
                                    <div>
                                    {selectedPlace[film.id]}
                                    <button className="button" onClick={() => toggleOpenInput(film.id, setOpenPlaceInput)}>Modify</button>
                                    </div>
                                )}
                            </td>
                            <td className="table-cell">
                                <p className='link removeLink' onClick={() => { removeToAlreadyWatched(film.id) }}>
                                    <FontAwesomeIcon icon={faTrashCan} /> Remove
                                </p>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ScrollToTopBtn />
        </div>
    );
}
