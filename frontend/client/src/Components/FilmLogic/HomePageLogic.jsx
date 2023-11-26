import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import FilterBySearchBar from '../../Actions/FilterBySearchBar';
import FilterByTags from '../../Actions/FilterByTags';
import Sort from '../../Actions/Sort';

import { setFilteredFilms } from '../../redux/reducers/filmReducer';

export default function FilmListLogic() {
    const films = useSelector((state) => state.film.films);
    const searchValue = useSelector((state) => state.search.searchValue);
    const sortValue = useSelector((state) => state.sort.sortValue);
    const tags = useSelector((state) => state.selectTags.selectTagsValue);

    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const updateFilteredFilms = () => {
            if (!Array.isArray(films)) {
                document.body.classList.add('no-scroll');
                setLoading(true);
                dispatch(setFilteredFilms([]));
            } else {
                document.body.classList.remove('no-scroll');

                let filtered = FilterBySearchBar(films, searchValue);
                filtered = Sort(filtered, sortValue);
                filtered = FilterByTags(filtered, tags);

                dispatch(setFilteredFilms(filtered));
                setLoading(false);
            }
        };

        updateFilteredFilms();
    }, [searchValue, sortValue, films, tags, dispatch]);

    return { loading };
}
