import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, text, color = '#f8e825' }) => {
    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((index) => (
                <span key={index} style={{ color }} className="mr-0.5">
                    {value >= index ? (
                        <FaStar />
                    ) : value >= index - 0.5 ? (
                        <FaStarHalfAlt />
                    ) : (
                        <FaRegStar />
                    )}
                </span>
            ))}
            <span className="ml-2 text-sm text-gray-600">{text && text}</span>
        </div>
    );
};

export default Rating;
