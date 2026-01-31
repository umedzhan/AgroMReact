import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import CartContext from '../context/CartContext';

const CartScreen = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, addToCart } = useContext(CartContext);

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4" role="alert">
                    <p>
                        Your cart is empty. <Link to="/" className="underline font-bold">Go Back</Link>
                    </p>
                </div>
            ) : (
                <div className="md:flex md:space-x-8">
                    <div className="md:w-2/3">
                        {cartItems.map((item) => (
                            <div key={item._id} className="flex items-center justify-between border-b border-gray-200 py-4">
                                <div className="flex items-center space-x-4 w-1/2">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                    <Link to={`/product/${item._id}`} className="text-green-600 font-semibold hover:underline">
                                        {item.name}
                                    </Link>
                                </div>

                                <div className="w-1/6 text-lg font-bold text-gray-800">${item.price}</div>

                                <div className="w-1/6">
                                    <select
                                        value={item.qty}
                                        onChange={(e) => addToCart(item, Number(e.target.value))}
                                        className="border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        {[...Array(item.countInStock).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>
                                                {x + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="w-1/12 text-right">
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="md:w-1/3 mt-8 md:mt-0">
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm sticky top-24">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
                            </h2>
                            <p className="text-xl font-bold text-gray-900 mb-6">
                                ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                            </p>

                            <button
                                onClick={checkoutHandler}
                                disabled={cartItems.length === 0}
                                className={`w-full py-3 rounded-md font-semibold text-white transition-colors shadow-md ${cartItems.length > 0
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Proceed To Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartScreen;
