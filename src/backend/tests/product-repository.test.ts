import { ProductRepository } from '../repositories/product-repository';
import { Product } from '../models/Product';

const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
};

jest.mock('../config/database', () => ({
    AppDataSource: {
        getRepository: jest.fn(() => mockRepository),
    },
}));

describe('ProductRepository', () => {
    let productRepository: ProductRepository;

    beforeEach(() => {
        jest.clearAllMocks();
        productRepository = new ProductRepository();
    });

    describe('create', () => {
        it('should create a new product', async () => {
            mockRepository.find.mockResolvedValue([]);
            mockRepository.create.mockReturnValue({ name: 'Apple' });
            mockRepository.save.mockResolvedValue({ id: '1', name: 'Apple' });

            const result = await productRepository.create({ name: 'Apple', user_id: '1' } as Product);
            expect(result.id).toBe('1');
        });

        it('should throw if product exists', async () => {
            mockRepository.find.mockResolvedValue([{ name: 'Apple' }]);
            await expect(productRepository.create({ name: 'apple', user_id: '1' } as Product)).rejects.toThrow('Product already exists');
        });
    });

    describe('findByUserId', () => {
        it('should find products by user id', async () => {
            mockRepository.find.mockResolvedValue([{ id: '1' }]);
            const result = await productRepository.findByUserId('1');
            expect(result.length).toBe(1);
        });
    });

    describe('findById', () => {
        it('should find product by id', async () => {
            mockRepository.findOne.mockResolvedValue({ id: '1' });
            const result = await productRepository.findById('1');
            expect(result?.id).toBe('1');
        });
    });

    describe('delete', () => {
        it('should delete product', async () => {
            mockRepository.delete.mockResolvedValue({});
            await productRepository.delete('1');
            expect(mockRepository.delete).toHaveBeenCalledWith('1');
        });
    });
});
