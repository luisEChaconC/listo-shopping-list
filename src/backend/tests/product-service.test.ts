import { ProductService } from '../services/product-service';

const mockProductRepository = {
    create: jest.fn(),
    findByUserId: jest.fn(),
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
                user: null,
                shoppingListProducts: []
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
    describe('getUserProducts', () => {
        it('should return formatted products for a user including predefined ones', async () => {
            const mockProducts = [
                {
                    id: '1',
                    name: 'Milk',
                    is_predefined: true,
                    user_id: null
                },
                {
                    id: '2',
                    name: 'Custom Product',
                    is_predefined: false,
                    user_id: 'user123'
                }
            ];

            const expectedResult = [
                {
                    id: '1',
                    name: 'Milk',
                    is_predefined: true,
                    user_id: null
                },
                {
                    id: '2',
                    name: 'Custom Product',
                    is_predefined: false,
                    user_id: 'user123'
                }
            ];

            mockProductRepository.findByUserId.mockResolvedValue(mockProducts);

            const result = await productService.getUserProducts('user123');

            expect(mockProductRepository.findByUserId).toHaveBeenCalledWith('user123');
            expect(result).toEqual(expectedResult);
        });

        it('should return empty array when user has no products', async () => {
            mockProductRepository.findByUserId.mockResolvedValue([]);

            const result = await productService.getUserProducts('user123');

            expect(mockProductRepository.findByUserId).toHaveBeenCalledWith('user123');
            expect(result).toEqual([]);
        });

        it('should handle repository errors', async () => {
            const error = new Error('Database connection failed');
            mockProductRepository.findByUserId.mockRejectedValue(error);

            await expect(productService.getUserProducts('user123')).rejects.toThrow('Database connection failed');
        });
    });
});
