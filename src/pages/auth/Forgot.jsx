import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function Forgot() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/login`,
        });

        if (error) {
            setError(error.message || 'Gagal mengirim email reset password. Silakan coba lagi.');
            setLoading(false);
            return;
        }

        setMessage('Link reset password telah dikirim ke email Anda. Periksa inbox Anda segera.');
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex bg-stone-50 font-sans">
            
            {/* Bagian Kiri - Branding & Ilustrasi (Hanya tampil di layar besar) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#92400e] to-[#451a03] flex-col justify-center items-center p-12 text-white relative overflow-hidden">
                {/* Elemen Dekorasi Latar Belakang */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500 opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#78350f] opacity-40 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
                
                <div className="z-10 text-center max-w-lg">
                    {/* Ikon Dekoratif Kopi (Menggunakan SVG murni) */}
                    <div className="mx-auto bg-white/10 p-5 rounded-full w-24 h-24 flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20 shadow-lg shadow-amber-900/30">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-amber-300">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12V6a.75.75 0 01.75-.75h13.5a.75.75 0 01.75.75v6a5.25 5.25 0 01-5.25 5.25H7.5A5.25 5.25 0 012.25 12zm15-4.5h2.25a2.25 2.25 0 012.25 2.25v.375a2.25 2.25 0 01-2.25 2.25H17.25" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 3v2.25M11.25 3v2.25" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-extrabold mb-4 tracking-tight drop-shadow-md text-amber-50">
                        Papi Coffee
                    </h1>
                    <p className="text-lg text-amber-100/80 font-light leading-relaxed">
                        Sistem manajemen kedai cerdas. Kelola operasional, pesanan, dan inventaris dengan mudah. Pastikan setiap seduhan kopi sampai ke tangan pelanggan dengan sempurna.
                    </p>
                </div>
            </div>

            {/* Bagian Kanan - Form Forgot */}
            <div className="flex-1 flex items-center justify-center p-8 sm:p-12 relative">
                
                {/* Dekorasi Mobile (lingkaran kecil di pojok) */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-bl-full opacity-50 lg:hidden"></div>

                <div className="w-full max-w-md mx-auto z-10">
                    
                    {/* Header Mobile (Hanya tampil di layar kecil) */}
                    <div className="lg:hidden text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-[#92400e] mb-4 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12V6a.75.75 0 01.75-.75h13.5a.75.75 0 01.75.75v6a5.25 5.25 0 01-5.25 5.25H7.5A5.25 5.25 0 012.25 12zm15-4.5h2.25a2.25 2.25 0 012.25 2.25v.375a2.25 2.25 0 01-2.25 2.25H17.25" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 3v2.25M11.25 3v2.25" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-extrabold text-stone-800">Papi Coffee</h2>
                        <p className="text-stone-500 mt-1">Portal Admin Kedai</p>
                    </div>

                    <div className="mb-8 text-center lg:text-left">
                        <h3 className="text-2xl font-bold text-stone-800">Lupa Kata Sandi? ☕</h3>
                        <p className="text-stone-500 text-sm mt-2">Masukkan email Anda dan kami akan mengirimkan link untuk mengatur ulang kata sandi Anda.</p>
                    </div>

                    {message && (
                        <div className="bg-green-50 border-l-4 border-green-500 mb-6 p-4 text-sm text-green-700 rounded-r-lg shadow-sm">
                            <span className="font-medium">{message}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-stone-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl shadow-sm
                                    focus:outline-none focus:ring-2 focus:ring-[#d97706] focus:border-transparent transition-all duration-200
                                    placeholder-stone-400 text-stone-800"
                                placeholder="Masukkan email Anda"
                                required
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-[#f59e0b] hover:bg-[#fbbf24] text-stone-900 font-bold py-3.5 px-4
                                    rounded-xl shadow-md shadow-amber-200 transition-all duration-300 transform hover:-translate-y-0.5
                                    ${loading ? 'opacity-70 cursor-not-allowed transform-none hover:bg-[#f59e0b]' : ''}`}
                            >
                                {loading ? 'Mengirim...' : 'Kirim Link Reset'}
                            </button>
                        </div>
                    </form>
                    
                    <p className="text-center text-xs text-stone-400 mt-8 font-medium">
                        © {new Date().getFullYear()} Papi Coffeee. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}