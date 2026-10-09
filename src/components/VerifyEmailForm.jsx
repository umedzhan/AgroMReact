import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { tUZ } from '../utils/translateHelper';

const VerifyEmailForm = ({ email, onBack }) => {
    const { verifyEmail, resendVerification } = useContext(AuthContext);
    const [code, setCode] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        await verifyEmail(email, code);
        setSubmitting(false);
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-card w-full max-w-md border border-line">
            <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">{tUZ("Emailni tasdiqlang")}</h1>
            <p className="text-gray-600 text-sm text-center mb-6">
                <span className="font-semibold">{email}</span> {tUZ("manziliga 6 xonali kod yuborildi. Kodni quyiga kiriting.")}
            </p>

            <form onSubmit={submitHandler}>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="verification-code">
                        {tUZ("Tasdiqlash kodi")}
                    </label>
                    <input
                        type="text"
                        id="verification-code"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        placeholder="000000"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting || code.length !== 6}
                    className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition-colors disabled:opacity-50 shadow-md"
                >
                    {submitting ? tUZ('Tekshirilmoqda...') : tUZ('Tasdiqlash')}
                </button>
            </form>

            <div className="mt-4 flex justify-between text-sm">
                <button type="button" onClick={() => resendVerification(email)} className="text-green-600 hover:text-green-800 font-semibold">
                    {tUZ("Kodni qayta yuborish")}
                </button>
                <button type="button" onClick={onBack} className="text-gray-500 hover:text-gray-700">
                    {tUZ("Orqaga")}
                </button>
            </div>
        </div>
    );
};

export default VerifyEmailForm;
