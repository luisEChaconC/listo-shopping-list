
"use client"

import React, { useState } from 'react';
import ShoppingListCard from './components/ShoppingListCard'
import newShoppingListModal from './components/NewListModal'
import { ShoppingList } from './types'

async function getShoppingLists() {
    await new Promise(res => setTimeout(res, 500))
    return []
}

export default function ShoppingListsPage() {
    const [lists, setLists] = useState<ShoppingList[]>([])
    const [modalOpen, setModalOpen] = useState(false)
    React.useEffect(() => {
        (async () => {
            const data = await getShoppingLists()
            setLists(data as ShoppingList[])
        })()
    }, [])

    const handleCreateList = async (name: string) => {
        // Aquí deberías hacer el llamado real a la DB/API para crear la lista
        // Simulación:
        const newList = {
            id: Date.now().toString(),
            title: name,
            productList: [],
        }
        setLists(prev => [newList, ...prev])
        setModalOpen(false)
    }

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