
'use client'

import React, { useEffect, useState } from 'react';
import ShoppingListCard from './components/ShoppingListCard'

async function getShoppingLists() {
    // Simula una llamada a la base de datos/API
    await new Promise(res => setTimeout(res, 500))
    return [
        {
            id: '1',
            title: 'Weekly Groceries',
            productList: ['Milk', 'Eggs', 'Bread', 'Bananas'],
        },
        {
            id: '2',
            title: 'BBQ Party',
            productList: ['Steak', 'Corn', 'Soda', 'Chips'],
        },
        {
            id: '3',
            title: 'Pharmacy',
            productList: ['Aspirin', 'Bandages', 'Vitamins'],
        },
        {
            id: '4',
            title: 'Office Supplies',
            productList: ['Pens', 'Paper', 'Stapler', 'Markers', 'Folders', 'Highlighters', 'Tape', 'Notebooks'],
        },
    ]
}

export default async function ShoppingListsPage() {
    const lists = await getShoppingLists()

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
            {newShoppingListModal({ isOpen: modalOpen, onClose: () => setModalOpen(false), onCreate: handleCreateList })}
            <div className="w-full max-w-4xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Shopping Lists</h1>
                    <button
                        className="bg-black text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200"
                        onClick={() => setModalOpen(true)}
                    >
                        New List
                    </button>
                </div>
                {lists.length === 0 ? (
                    <div className="w-full flex flex-col items-center justify-center py-20">
                        <p className="text-gray-400 text-lg">No shopping lists found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                        {lists.map(list => (
                            <ShoppingListCard
                                key={list.id}
                                id={list.id}
                                title={list.title}
                                productList={list.productList}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}