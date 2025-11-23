const mockRepository = {
    find: jest.fn(),
};

const mockAppDataSource = {
    getRepository: jest.fn().mockReturnValue(mockRepository),
};

jest.mock('typeorm', () => ({
    Repository: jest.fn().mockImplementation(() => mockRepository),
    PrimaryGeneratedColumn: jest.fn(),
    PrimaryColumn: jest.fn(),
    Column: jest.fn(),
    ManyToOne: jest.fn(),
    JoinColumn: jest.fn(),
    OneToMany: jest.fn(),
    Entity: jest.fn(),
}));

jest.mock('../config/database', () => ({
    AppDataSource: mockAppDataSource,
}));

import { ShoppingListRepository } from '../repositories/shopping-list-repository';
import { ShoppingList } from '../models/ShoppingList';

describe('ShoppingListRepository', () => {
    let shoppingListRepository: ShoppingListRepository;

    beforeEach(() => {
        jest.clearAllMocks();
        shoppingListRepository = new ShoppingListRepository();
    });

    describe('findByUserId', () => {
        it('should return shopping lists for a user with relations', async () => {
            const userId = 'user123';
            const mockShoppingLists: ShoppingList[] = [
                {
                    id: '1',
                    name: 'Weekly Groceries',
                    user_id: userId,
                    is_completed: false,
                    added_at: new Date(),
                    user: {} as any, // Mock user object
                    shoppingListProducts: []
                },
                {
                    id: '2',
                    name: 'Party Supplies',
                    user_id: userId,
                    is_completed: false,
                    added_at: new Date(),
                    user: {} as any, // Mock user object
                    shoppingListProducts: []
                }
            ];

            mockRepository.find.mockResolvedValue(mockShoppingLists);

            const result = await shoppingListRepository.findByUserId(userId);

            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { user_id: userId },
                relations: ['shoppingListProducts', 'shoppingListProducts.product'],
                order: { added_at: 'DESC' }
            });
            expect(result).toEqual(mockShoppingLists);
        });

        it('should return empty array when user has no shopping lists', async () => {
            const userId = 'user123';

            mockRepository.find.mockResolvedValue([]);

            const result = await shoppingListRepository.findByUserId(userId);

            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { user_id: userId },
                relations: ['shoppingListProducts', 'shoppingListProducts.product'],
                order: { added_at: 'DESC' }
            });
            expect(result).toEqual([]);
        });

        it('should handle repository errors', async () => {
            const userId = 'user123';
            const error = new Error('Database connection failed');

            mockRepository.find.mockRejectedValue(error);

            await expect(shoppingListRepository.findByUserId(userId)).rejects.toThrow('Database connection failed');
        });
    });
});