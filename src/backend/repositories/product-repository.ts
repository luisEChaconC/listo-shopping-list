import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { Product } from "../models/Product";

export class ProductRepository {
    private repository: Repository<Product>;

    constructor() {
        this.repository = AppDataSource.getRepository(Product);
    }

    async findByUserId(userId: string): Promise<Product[]> {
        return this.repository.find({
            where: [
                { user_id: userId },
                { is_predefined: true }
            ]
        });
    }
}