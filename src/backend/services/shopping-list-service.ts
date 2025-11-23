import { ShoppingListRepository } from '../repositories/shopping-list-repository';

export class ShoppingListService {
    private shoppingListRepository: ShoppingListRepository;

    constructor() {
        this.shoppingListRepository = new ShoppingListRepository();
    }

    async getShoppingListsByUserId(userId: string) {
        const shoppingLists = await this.shoppingListRepository.findByUserId(userId);
        return shoppingLists.map(list => ({
            id: list.id,
            title: list.name, // Map name to title for frontend compatibility
            productList: list.shoppingListProducts?.map(slp => slp.product.name) || []
        }));
    }
}