"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function ShoppingListCard({ id, title, productList }: { id: string; title: string; productList: string[] }) {
    const displayProducts = productList.slice(0, 5)
    return (
        <motion.div
            whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6 cursor-pointer h-64 flex flex-col w-full max-w-xs"
        >
            <Link href={{ pathname: "/shopList", query: { id } }} className="flex-1 flex flex-col">
                <h2 className="text-xl font-bold text-gray-900 mb-2 truncate">{title}</h2>
                <ul className="text-gray-400 text-sm space-y-1">
                    {displayProducts.map((item, idx) => (
                        <li key={idx} className="truncate max-w-full">{item}</li>
                    ))}
                    {productList.length > 5 && (
                        <li className="italic text-xs text-gray-300">and {productList.length - 5} more...</li>
                    )}
                </ul>
            </Link>
        </motion.div>
    )
}
