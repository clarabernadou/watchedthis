import FilmListLogic from './HomePageLogic';
import HalloweenLogic from './HalloweenLogic';
import WatchlistLogic from './WatchlistLogic';
import AlreadyWatchedLogic from './AlreadyWatchedLogic';

export default function getFilmListLogic(option) {
    switch (option) {
        case 'home':
            const filmListLogic = FilmListLogic();
            return filmListLogic;
        case 'watchlist':
            const watchlistLogic = WatchlistLogic();
            return watchlistLogic;
        case 'alreadyWatched':
            const alreadyWatchedLogic = AlreadyWatchedLogic();
            return alreadyWatchedLogic;
        case 'halloween':
            const halloweenLogic = HalloweenLogic();
            return halloweenLogic;
        default:
            const defaultLogic = FilmListLogic();
            return defaultLogic;
    }
}
