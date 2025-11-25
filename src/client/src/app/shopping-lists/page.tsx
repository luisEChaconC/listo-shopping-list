
'use client'

import React, { useEffect, useState } from 'react';
import ShoppingListCard from './components/ShoppingListCard'
import NewListModal from './components/NewListModal'
import { getShoppingLists, createShoppingList } from '../../api/shopping-lists'
import { ShoppingList } from './types'
import { NotificationService } from '../../utils/notifications'

export default function ShoppingListsPage() {
    const [lists, setLists] = useState<ShoppingList[]>([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)

    const handleCreateList = async (name: string) => {
        const result = await createShoppingList(name);
        if (result.success && result.shoppingList) {
            // Add the new list to the current lists
            setLists(prev => [result.shoppingList!, ...prev]);
            NotificationService.showSuccess('Shopping list created successfully!');
        } else if (result.error) {
            NotificationService.showError('Error creating shopping list', result.error);
        }
        setModalOpen(false);
    }

    useEffect(() => {
        const fetchShoppingLists = async () => {
            const result = await getShoppingLists()
            if (result.success && result.shoppingLists) {
                setLists(result.shoppingLists)
            } else if (result.error) {
                NotificationService.showError('Error loading shopping lists', result.error)
            }
            setLoading(false)
        }

        fetchShoppingLists()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-10 px-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                <p className="mt-4 text-gray-600">Loading shopping lists...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
            <NewListModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onCreate={handleCreateList}
            />
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