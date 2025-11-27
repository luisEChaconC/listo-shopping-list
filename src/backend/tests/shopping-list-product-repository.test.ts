import { ShoppingListProductsRepository } from '../repositories/shopping-list-product-repository';
import { ShoppingListProduct } from '../models/ShoppingListProduct';

const mockRepository = {
    find: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
};

jest.mock('../config/database', () => ({
    AppDataSource: {
        getRepository: jest.fn(() => mockRepository),
    },
}));

describe('ShoppingListProductsRepository', () => {
    let repository: ShoppingListProductsRepository;

    beforeEach(() => {
        jest.clearAllMocks();
        repository = new ShoppingListProductsRepository();
    });

    describe('findByListId', () => {
        it('should find products by list id', async () => {
            mockRepository.find.mockResolvedValue([{ id: '1' }]);
            const result = await repository.findByListId('list1');
            expect(result.length).toBe(1);
        });
    });

    describe('createOrUpdate', () => {
        it('should save entry', async () => {
            const entry = { list_id: '1', product_id: '2' } as ShoppingListProduct;
            mockRepository.save.mockResolvedValue(entry);
            const result = await repository.createOrUpdate(entry);
            expect(result.list_id).toBe('1');
        });
    });

    describe('delete', () => {
        it('should delete entry', async () => {
            mockRepository.delete.mockResolvedValue({});
            await repository.delete('list1', 'product1');
            expect(mockRepository.delete).toHaveBeenCalledWith({ list_id: 'list1', product_id: 'product1' });
        });
    });
});
