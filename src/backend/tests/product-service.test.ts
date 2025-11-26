import { ProductService } from '../services/product-service';

const mockProductRepository = {
    create: jest.fn(),
};

jest.mock('../repositories/product-repository', () => ({
    ProductRepository: jest.fn().mockImplementation(() => mockProductRepository),
}));

describe('ProductService', () => {
    let productService: ProductService;

    beforeEach(() => {
        jest.clearAllMocks();
        productService = new ProductService();
    });

    describe('createProduct', () => {
        it('should create a product', async () => {
            const mockProduct = {
                id: '123',
                name: 'Test Product',
                user_id: 'user-123',
                is_predefined: false,
            };

            mockProductRepository.create.mockResolvedValue(mockProduct);

            const result = await productService.createProduct({
                name: 'Test Product',
                user_id: 'user-123',
            });

            expect(mockProductRepository.create).toHaveBeenCalledWith({
                name: 'Test Product',
                user_id: 'user-123',
                is_predefined: false,
            });
            expect(result).toEqual({
                id: '123',
                name: 'Test Product',
                user_id: 'user-123',
                is_predefined: false,
            });
        });

        it('should throw error when product name is empty', async () => {
            await expect(productService.createProduct({
                name: '',
                user_id: 'user-123',
            })).rejects.toThrow('Product name is required');

            expect(mockProductRepository.create).not.toHaveBeenCalled();
        });

        it('should throw error when product name is only whitespace', async () => {
            await expect(productService.createProduct({
                name: '   ',
                user_id: 'user-123',
            })).rejects.toThrow('Product name is required');

            expect(mockProductRepository.create).not.toHaveBeenCalled();
        });
    });
});
