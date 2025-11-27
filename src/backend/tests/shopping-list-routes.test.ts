import request from 'supertest';
import express from 'express';
import shoppingListRoutes from '../routes/shopping-list-routes';
import { AuthRequest } from '../middleware/auth-middleware';

jest.mock('../services/shopping-list-service');
import { ShoppingListService } from '../services/shopping-list-service';

const app = express();
app.use(express.json());
app.use((req, _res, next) => { (req as AuthRequest).user = { id: '1', email: 'test@test.com', name: 'Test' }; next(); });
app.use('/lists', shoppingListRoutes);

describe('Shopping List Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /', () => {
        it('should get shopping lists', async () => {
            (ShoppingListService.prototype.getShoppingListsByUserId as jest.Mock).mockResolvedValue([{ id: '1', name: 'Groceries' }]);
            const res = await request(app).get('/lists');
            expect(res.status).toBe(200);
        });

        it('should handle server error', async () => {
            (ShoppingListService.prototype.getShoppingListsByUserId as jest.Mock).mockRejectedValue(new Error('Server error'));
            const res = await request(app).get('/lists');
            expect(res.status).toBe(500);
        });
    });

    describe('POST /', () => {
        it('should create shopping list', async () => {
            (ShoppingListService.prototype.createShoppingList as jest.Mock).mockResolvedValue({ id: '1', name: 'Groceries' });
            const res = await request(app).post('/lists').send({ name: 'Groceries' });
            expect(res.status).toBe(201);
        });

        it('should reject empty name', async () => {
            const res = await request(app).post('/lists').send({ name: '' });
            expect(res.status).toBe(400);
        });

        it('should reject missing name', async () => {
            const res = await request(app).post('/lists').send({});
            expect(res.status).toBe(400);
        });

        it('should reject non-string name', async () => {
            const res = await request(app).post('/lists').send({ name: 123 });
            expect(res.status).toBe(400);
        });

        it('should handle duplicate name', async () => {
            (ShoppingListService.prototype.createShoppingList as jest.Mock).mockRejectedValue(new Error('Shopping list with this name already exists'));
            const res = await request(app).post('/lists').send({ name: 'Groceries' });
            expect(res.status).toBe(409);
        });

        it('should handle server error', async () => {
            (ShoppingListService.prototype.createShoppingList as jest.Mock).mockRejectedValue(new Error('Server error'));
            const res = await request(app).post('/lists').send({ name: 'Groceries' });
            expect(res.status).toBe(500);
        });
    });
});
