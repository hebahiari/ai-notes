'use client'

import { useState } from 'react';
import { Input } from './ui/input';
import Note from './Note';
import { Note as NoteType } from '@prisma/client';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<NoteType[]>([]);

    const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuery(value);
        if (value.length > 2) {
            const res = await fetch(`/api/notes?search=${value}`);
            const json = await res.json()
            console.log(json)
            setResults(json);

        } else {
            setResults([]);
        }
    };

    return (
        <div>
            <Input
                value={query}
                onChange={handleSearch}
                placeholder="Search..."
            />
            <ul>
                {results.map((note) => (
                    <Note note={note} key={note.id} />
                ))}
            </ul>
        </div>
    );
};

export default SearchBar;
