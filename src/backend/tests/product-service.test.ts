import { ProductService } from '../services/product-service';

const mockProductRepository = {
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