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
}