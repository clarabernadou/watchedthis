import React from 'react';
import { useSelector } from 'react-redux';
import './tagsSection.css';
import Tag from '../Tag/Tag';

export default function TagsSection() {
    const tags = useSelector((state) => state.selectTags.selectTagsValue);
    return (
        <div className='tagsContainer'>
            {tags.map((tag) => (
                <Tag id={tag.id} name={tag.name} pageFilm={false} />
            ))}
        </div>
    );
}
