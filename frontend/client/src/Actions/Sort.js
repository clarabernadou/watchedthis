export default function sortFilms(films, sortValue) {
    let sorted = [...films];

    switch (sortValue) {
        case 'Alphabetical order (a-z)':
            sorted = sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'Anti-alphabetical order (z-a)':
            sorted = sorted.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'Release Date (latest to earliest)':
            sorted = sorted.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
            break;
        case 'Release Date (earliest to latest)':
            sorted = sorted.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
            break;
        default:
            sorted = sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }

    return sorted;
}