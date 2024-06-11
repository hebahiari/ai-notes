'use client'

import { useState } from 'react';
import { Input } from './ui/input';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuery(value);
        if (value.length > 2) {
            const res = await fetch(`/api/notes?search=${value}`);
            console.log({ res })
            // const data = await res.json();
            // setResults(data);

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
                {results.map((item: { id: number, name: string }) => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default SearchBar;
