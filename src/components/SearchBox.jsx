import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const SearchBox = () => {
    const navigate = useNavigate();
    const { keyword: urlKeyword } = useParams();
    const [keyword, setKeyword] = useState(urlKeyword || '');

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search/${keyword}`);
        } else {
            navigate('/');
        }
    };

    return (
        <form onSubmit={submitHandler} className="flex w-full items-center bg-gray-100 rounded overflow-hidden">
            <div className="px-4 text-gray-500">
                <FaSearch />
            </div>
            <input
                type="text"
                name="q"
                onChange={(e) => setKeyword(e.target.value)}
                value={keyword}
                placeholder="Search products"
                className="w-full py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
            <button type="submit" className="px-6 py-3 bg-brand text-white hover:bg-brand-dark transition-colors font-semibold">
                Search
            </button>
        </form>
    );
};

export default SearchBox;
