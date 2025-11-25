'use client'

import React, { useEffect, useState } from "react";
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

    return (
        <header className="w-full bg-gray-100 text-gray-700 py-4 px-6 flex justify-between items-center">
            <div className="text-2xl font-bold">Listo Shopping List</div>
            <nav className="flex gap-6 items-center">
                {user ? (
                    <>
                        <span>Welcome, {user.name}</span>
                        <a href="/products" className="hover:underline">Products</a>
                        <a href="/shopping-lists" className="hover:underline">Lists</a>
                    </>
                ) : (
                    <>
                        <a href="/products" className="hover:underline">Products</a>
                        <a href="/shopping-lists" className="hover:underline">Lists</a>
                    </>
                )}
            </nav>
        </header>
    );
}
