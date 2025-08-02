import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import ModalLogoutConfirm from './ModalLogout'

export default function TopMenu() {
    //state dropdown
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    //state untuk menampilkan modal konfirmasi logout
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    //state untuk menyimpan data user
    const [user, setUser] = useState(null);
    const location = useLocation();//untuk mendapatkan route saat ini

    const navigate = useNavigate();

    //ambil email user dari localStorage (digunakan jika perlu)
    const emailUser = localStorage.getItem('email');


    useEffect(() => {
        const fetchUser = async () => {
            //ambil token
            const token = localStorage.getItem("token");

            if (!token) return;//kalau token tidak ada hentikan

            try {
                //fetch data all user
                const response = await fetch("http://localhost:5000/api/user/", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const result = await response.json();

                if (response.ok) {
                    //simpan data user ke dalam state jika berhasil
                    setUser(result.data);
                } else {
                    console.error("Failed :", result.message);
                }
            } catch (error) {
                console.error("Error :", error);
            }
        };

        fetchUser();
    }, []);

//handle logout
    const handleLogout = async () => {
        //ambil token
        const token = localStorage.getItem("token");
        try {
            //kirim req logout ke backend
            await fetch("http://localhost:5000/api/auth/v1/logout", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
        } catch (err) {
            console.error("Logout failed:", err);
        }

        //remove semua data user dari localstorage
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        localStorage.removeItem("roleId");

        //arahkan user ke halaman login
        navigate("/login");
    };

    return (
        <>
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                            ProjectM
                        </span>
                    </Link>

                    {/* User menu and hamburger */}
                    <div className="relative flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <button
                            type="button"
                            className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            aria-expanded={isDropdownOpen}
                        >
                            <span className="sr-only">Open user menu</span>
                            <img
                                className="w-8 h-8 rounded-full"
                                src="/ic_profile.svg"
                                alt="user"
                            />
                        </button>

                        {/* Dropdown */}
                        {isDropdownOpen && (
                            <div
                                className="absolute top-full right-0 mt-2 z-50 w-48 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600"
                                id="user-dropdown"
                            >
                                <div className="px-4 py-3">
                                    <span className="block text-sm text-gray-900 dark:text-white">{user?.username}</span>
                                    <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                                        {emailUser}
                                    </span>
                                </div>
                                <ul className="py-2">
                                    {["Sign out"].map((item) => (
                                        <li key={item}>
                                            <a
                                                href="#"
                                                onClick={() => setShowLogoutModal(true)}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                            >
                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Hamburger */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            type="button"
                            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            aria-controls="navbar-user"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg
                                className="w-5 h-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 17 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M1 1h15M1 7h15M1 13h15"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Navbar menu */}
                    <div
                        className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMenuOpen ? "flex" : "hidden"
                            }`}
                        id="navbar-user"
                    >
                        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            {["Dashboard", "Task", "User"].map((item, idx) => (
                                <li key={item}>
                                    <Link
                                        to={`/${item.toLowerCase()}`} // link for menus
                                        className={`block py-2 px-3 rounded-sm md:p-0 ${location.pathname === `/${item.toLowerCase()}`
                                            ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500"
                                            : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                                            }`}
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>

            {showLogoutModal && (
                <ModalLogoutConfirm
                    onConfirm={handleLogout}
                    onCancel={() => setShowLogoutModal(false)}
                />
            )}
        </>
    )
}
