import { ShoppingListService } from '../services/shopping-list-service';

const mockShoppingListRepository = {
    findByUserId: jest.fn(),
};

jest.mock('../repositories/shopping-list-repository', () => ({
    ShoppingListRepository: jest.fn().mockImplementation(() => mockShoppingListRepository),
}));

describe('ShoppingListService', () => {
    let shoppingListService: ShoppingListService;

    beforeEach(() => {
        jest.clearAllMocks();
        shoppingListService = new ShoppingListService();
    });

    describe('getShoppingListsByUserId', () => {
        it('should return formatted shopping lists when user has lists', async () => {
            const mockShoppingLists = [
                {
                    id: '1',
                    name: 'Weekly Groceries',
                    shoppingListProducts: [
                        { product: { name: 'Milk' } },
                        { product: { name: 'Bread' } }
                    ]
                },
                {
                    id: '2',
                    name: 'Party Supplies',
                    shoppingListProducts: null
                }
            ];

            const expectedResult = [
                {
                    id: '1',
                    title: 'Weekly Groceries',
                    productList: ['Milk', 'Bread']
                },
                {
                    id: '2',
                    title: 'Party Supplies',
                    productList: []
                }
            ];

            mockShoppingListRepository.findByUserId.mockResolvedValue(mockShoppingLists);

            const result = await shoppingListService.getShoppingListsByUserId('user123');

            expect(mockShoppingListRepository.findByUserId).toHaveBeenCalledWith('user123');
            expect(result).toEqual(expectedResult);
        });

        it('should return empty array when user has no lists', async () => {
            mockShoppingListRepository.findByUserId.mockResolvedValue([]);

            const result = await shoppingListService.getShoppingListsByUserId('user123');

            expect(mockShoppingListRepository.findByUserId).toHaveBeenCalledWith('user123');
            expect(result).toEqual([]);
        });

        it('should handle repository errors', async () => {
            const error = new Error('Database connection failed');
            mockShoppingListRepository.findByUserId.mockRejectedValue(error);

            await expect(shoppingListService.getShoppingListsByUserId('user123')).rejects.toThrow('Database connection failed');
        });
    });
});