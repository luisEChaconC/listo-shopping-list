import { ProductRepository } from "../repositories/product-repository";

export class ProductService {
    private productRepository: ProductRepository;

    constructor() {
        this.productRepository = new ProductRepository();
    }

    async getUserProducts(userId: string): Promise<any[]> {
        const products = await this.productRepository.findByUserId(userId);
        return products.map(product => ({
            id: product.id,
            name: product.name,
            is_predefined: product.is_predefined,
            user_id: product.user_id
        }));
    }

    async deleteUserProduct(productId: string, userId: string): Promise<void> {
        const product = await this.productRepository.findById(productId);

        if (!product) {
            throw new Error("Product not found");
        }

        if (product.is_predefined) {
            throw new Error("Cannot delete predefined products");
        }

        if (product.user_id !== userId) {
            throw new Error("Product is not owned by the user");
        }

        await this.productRepository.delete(productId);
    }
}