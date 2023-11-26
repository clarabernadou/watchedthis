export default function FilterByTags(films, tags) {
    const tagsId = tags.map((tag) => tag.id);
    const filteredByTags = films.filter((film) => {
        return tagsId.every(tagId => film.genre_ids.includes(tagId));
    });
    return filteredByTags;
}