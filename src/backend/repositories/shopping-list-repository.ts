import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { ShoppingList } from "../models/ShoppingList";

export class ShoppingListRepository {
    private repository: Repository<ShoppingList>;

    constructor() {
        this.repository = AppDataSource.getRepository(ShoppingList);
    }

    async findByUserId(userId: string): Promise<ShoppingList[]> {
        return await this.repository.find({
            where: { user_id: userId },
            relations: ['shoppingListProducts', 'shoppingListProducts.product'],
            order: { added_at: 'DESC' }
        });
    }
}