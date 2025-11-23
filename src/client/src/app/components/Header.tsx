'use client'

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faShoppingCart, faList, faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { AuthStorage } from "../../utils/auth-storage";
import { NotificationService } from "../../utils/notifications";

export default function Header() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await AuthStorage.getUser();
            if (user) {
                setUser(user);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        await AuthStorage.clear();
        window.location.href = '/login';
    };

    return (
        <header className="w-full bg-gray-100 text-gray-700 py-4 px-6 flex justify-between items-center">
            <div className="text-2xl font-bold">Listo Shopping List</div>
            <nav className="flex gap-6 items-center">
                {user ? (
                    <>
                        <span className="text-gray-500">Welcome, {user.name}</span>
                        <a href="/products" className="hover:underline flex items-center gap-2">
                            <FontAwesomeIcon icon={faShoppingCart} />
                            Products
                        </a>
                        <a href="/shopping-lists" className="hover:underline flex items-center gap-2">
                            <FontAwesomeIcon icon={faList} />
                            Lists
                        </a>
                        <button onClick={handleLogout} className="bg-black hover:bg-gray-800 text-white px-3 py-1 rounded flex items-center gap-2">
                            <FontAwesomeIcon icon={faSignOutAlt} />
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <a href="/login" className="hover:underline flex items-center gap-2">
                            <FontAwesomeIcon icon={faSignInAlt} />
                            Login
                        </a>
                        <a href="/signup" className="hover:underline flex items-center gap-2">
                            <FontAwesomeIcon icon={faUserPlus} />
                            Signup
                        </a>
                    </>
                )}
            </nav>
        </header>
    );
}
