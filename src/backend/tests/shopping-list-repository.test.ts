import { ShoppingListRepository } from '../repositories/shopping-list-repository';
import { ShoppingList } from '../models/ShoppingList';

const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
};

jest.mock('../config/database', () => ({
    AppDataSource: {
        getRepository: jest.fn(() => mockRepository),
    },
}));

describe('ShoppingListRepository', () => {
    let repository: ShoppingListRepository;

    beforeEach(() => {
        jest.clearAllMocks();
        repository = new ShoppingListRepository();
    });

    describe('findByUserId', () => {
        it('should find shopping lists by user id', async () => {
            mockRepository.find.mockResolvedValue([{ id: '1', name: 'Groceries' }]);
            const result = await repository.findByUserId('user1');
            expect(result.length).toBe(1);
        });
    });

    describe('create', () => {
        it('should create a new shopping list', async () => {
            mockRepository.findOne.mockResolvedValue(null);
            mockRepository.create.mockReturnValue({ name: 'Groceries' });
            mockRepository.save.mockResolvedValue({ id: '1', name: 'Groceries' });

            const result = await repository.create('Groceries', 'user1');
            expect(result.id).toBe('1');
        });

        it('should throw if list name exists', async () => {
            mockRepository.findOne.mockResolvedValue({ id: '1', name: 'Groceries' });
            await expect(repository.create('Groceries', 'user1')).rejects.toThrow('Shopping list with this name already exists');
        });
    });
});
