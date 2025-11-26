import { ProductService } from '../services/product-service';

const mockProductRepository = {
    findByUserId: jest.fn(),
    findById: jest.fn(),
    delete: jest.fn(),
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

    describe('deleteUserProduct', () => {
        it('should delete a user product', async () => {
            const mockProduct = {
                id: 'product123',
                name: 'Custom Product',
                is_predefined: false,
                user_id: 'user123'
            };

            mockProductRepository.findById.mockResolvedValue(mockProduct);
            mockProductRepository.delete.mockResolvedValue(undefined);

            await productService.deleteUserProduct('product123', 'user123');

            expect(mockProductRepository.findById).toHaveBeenCalledWith('product123');
            expect(mockProductRepository.delete).toHaveBeenCalledWith('product123');
        });

        it('should throw error when product can not be found', async () => {
            mockProductRepository.findById.mockResolvedValue(null);

            await expect(productService.deleteUserProduct('product123', 'user123'))
                .rejects.toThrow('Product not found');

            expect(mockProductRepository.findById).toHaveBeenCalledWith('product123');
            expect(mockProductRepository.delete).not.toHaveBeenCalled();
        });

        it('should throw error when trying to delete predefined product', async () => {
            const mockProduct = {
                id: 'product123',
                name: 'Milk',
                is_predefined: true,
                user_id: null
            };

            mockProductRepository.findById.mockResolvedValue(mockProduct);

            await expect(productService.deleteUserProduct('product123', 'user123'))
                .rejects.toThrow('Cannot delete predefined products');

            expect(mockProductRepository.findById).toHaveBeenCalledWith('product123');
            expect(mockProductRepository.delete).not.toHaveBeenCalled();
        });

        it('should throw error when trying to delete a product of another user', async () => {
            const mockProduct = {
                id: 'product123',
                name: 'Custom Product',
                is_predefined: false,
                user_id: 'otherUser'
            };

            mockProductRepository.findById.mockResolvedValue(mockProduct);

            await expect(productService.deleteUserProduct('product123', 'user123'))
                .rejects.toThrow('Product is not owned by the user');

            expect(mockProductRepository.findById).toHaveBeenCalledWith('product123');
            expect(mockProductRepository.delete).not.toHaveBeenCalled();
        });
    });
});