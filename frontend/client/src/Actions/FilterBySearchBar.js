export default function FilterBySearchBar(films, searchValue) {
    const lowerSearchValue = searchValue.toLowerCase();

    const filtered = films.filter((film) =>
        film.title.toLowerCase().includes(lowerSearchValue) ||
        film.original_title.toLowerCase().includes(lowerSearchValue) ||
        film.overview.toLowerCase().includes(lowerSearchValue)
    );

    return filtered;
}