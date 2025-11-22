import React from "react";

export default function Header() {
    return (
        <header className="w-full bg-gray-100 text-gray-700 py-4 px-6 flex justify-between items-center">
            <div className="text-2xl font-bold">Listo Shopping List</div>
            <nav className="flex gap-6">
                <a href="/products" className="hover:underline">Products</a>
                <a href="/shopping-lists" className="hover:underline">Lists</a>
            </nav>
        </header>
    );
}
