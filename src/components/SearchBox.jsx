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
        <form onSubmit={submitHandler} className="flex w-full items-center rounded-xl border border-line-strong bg-white overflow-hidden h-11 transition focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10">
            <div className="pl-3.5 pr-2.5 text-ink-400 flex items-center h-full">
                <FaSearch />
            </div>
            <input
                type="text"
                name="q"
                onChange={(e) => setKeyword(e.target.value)}
                value={keyword}
                placeholder={tUZ("Mahsulotlarni qidirish")}
                className="w-full h-full bg-transparent outline-none text-[15px] text-ink-900 placeholder:text-ink-300"
            />
            <button type="submit" className="m-1 h-9 rounded-lg px-4 bg-brand-600 text-sm text-white hover:bg-brand-700 transition-colors font-semibold">
                {tUZ("Qidirish")}
            </button>
        </form>
    );
};

export default SearchBox;
