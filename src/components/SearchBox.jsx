import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { tUZ } from '../utils/translateHelper';
import { useTranslation } from 'react-i18next';

const SearchBox = () => {
    useTranslation();
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
        <form onSubmit={submitHandler} className="flex w-full items-center bg-gray-100 rounded overflow-hidden h-10">
            <div className="px-4 text-gray-500 flex items-center h-full">
                <FaSearch />
            </div>
            <input
                type="text"
                name="q"
                onChange={(e) => setKeyword(e.target.value)}
                value={keyword}
                placeholder={tUZ("Mahsulotlarni qidirish")}
                className="w-full h-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
            <button type="submit" className="px-6 h-full bg-brand text-white hover:bg-brand-dark transition-colors font-semibold">
                {tUZ("Qidirish")}
            </button>
        </form>
    );
};

export default SearchBox;
