import { authenticatedFetch } from "../auth/authentication";
import { ShoppingList } from "./types";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export async function getShoppingLists(): Promise<{ success: boolean; shoppingLists?: ShoppingList[]; error?: string }> {
    try {
        const res = await authenticatedFetch(`${API_URL}/shopping-lists`);
        if (res.ok) {
            const data = await res.json();
            return { success: true, shoppingLists: data.shoppingLists };
        } else {
            const data = await res.json();
            return { success: false, error: data.error || "Failed to fetch shopping lists" };
        }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Failed to fetch shopping lists" };
    }
}