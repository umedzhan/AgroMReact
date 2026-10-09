import React from 'react';
import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
    return (
        pages > 1 && (
            <div className="flex justify-center mt-8">
                <nav className="inline-flex items-center gap-1.5" aria-label="Pagination">
                    {[...Array(pages).keys()].map((x) => (
                        <Link
                            key={x + 1}
                            to={
                                !isAdmin
                                    ? keyword
                                        ? `/search/${keyword}/page/${x + 1}`
                                        : `/page/${x + 1}`
                                    : `/admin/productlist/${x + 1}`
                            }
                            className={`grid size-10 place-items-center rounded-xl text-sm font-semibold transition ${
                                x + 1 === page
                                    ? 'bg-ink-900 text-white shadow-sm'
                                    : 'border border-line bg-white text-ink-600 hover:border-ink-300 hover:text-ink-900'
                            }`}
                        >
                            {x + 1}
                        </Link>
                    ))}
                </nav>
            </div>
        )
    );
};

export default Paginate;
