import { Repository, IsNull } from "typeorm";
import { AppDataSource } from "../config/database";
import { Product } from "../models/Product";

export class ProductRepository {
    private repository: Repository<Product>;

    constructor() {
        this.repository = AppDataSource.getRepository(Product);
    }

    async create(product: Omit<Product, "id">): Promise<Product> {
        const existing = await this.repository.findOne({
            where: {
                name: product.name,
                user_id: product.user_id === null ? IsNull() : product.user_id
            }
        });

        if (existing) {
            throw new Error("Product already exists");
        }

        const newProduct = this.repository.create(product);
        return await this.repository.save(newProduct);
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
