import request from 'supertest';
import express from 'express';
import shoppingListProductRoutes from '../routes/shopping-list-product-routes';
import { AuthRequest } from '../middleware/auth-middleware';

jest.mock('../services/shopping-list-product-service');
import { ShoppingListProductsService } from '../services/shopping-list-product-service';
import { validationMiddleware } from '../middleware/validation-middleware';
import { AddShoppingListProductDto } from '../dtos/AddShoppingListProductDto';
import { UpdateShoppingListProductDto } from '../dtos/UpdateShoppingListProductDto';

const app = express();
app.use(express.json());
app.use((req, _res, next) => { (req as AuthRequest).user = { id: '1', email: 'test@test.com', name: 'Test' }; next(); });

// Map of routes to DTOs for validation
const routeToDto: { [key: string]: any } = {
    '/list-products': AddShoppingListProductDto,  // for POST
};

app.use((req, res, next) => {
    if (req.method === 'POST' && req.path === '/list-products') {
        return validationMiddleware(AddShoppingListProductDto)(req, res, next);
    }
    if (req.method === 'PUT' && req.path === '/list-products') {
        return validationMiddleware(UpdateShoppingListProductDto)(req, res, next);
    }
    next();
});

app.use('/list-products', shoppingListProductRoutes);

describe('Shopping List Product Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /:listId', () => {
        it('should get list products', async () => {
            (ShoppingListProductsService.prototype.getProductsForList as jest.Mock).mockResolvedValue([{ id: '1' }]);
            const res = await request(app).get('/list-products/list1');
            expect(res.status).toBe(200);
        });

        it('should handle server error', async () => {
            (ShoppingListProductsService.prototype.getProductsForList as jest.Mock).mockRejectedValue(new Error('Server error'));
            const res = await request(app).get('/list-products/list1');
            expect(res.status).toBe(500);
        });
    });

    describe('POST /', () => {
        it('should add product', async () => {
            (ShoppingListProductsService.prototype.addProduct as jest.Mock).mockResolvedValue({ id: '1' });
            const res = await request(app).post('/list-products').send({ list_id: '1', product_id: '2' });
            expect(res.status).toBe(201);
        });

        it('should handle server error', async () => {
            (ShoppingListProductsService.prototype.addProduct as jest.Mock).mockRejectedValue(new Error('Server error'));
            const res = await request(app).post('/list-products').send({ list_id: '1', product_id: '2' });
            expect(res.status).toBe(500);
        });
    });

    describe('PUT /', () => {
        it('should update product', async () => {
            (ShoppingListProductsService.prototype.updateProduct as jest.Mock).mockResolvedValue({ id: '1' });
            const res = await request(app).put('/list-products').send({ list_id: '1', product_id: '2' });
            expect(res.status).toBe(200);
        });

        it('should handle server error', async () => {
            (ShoppingListProductsService.prototype.updateProduct as jest.Mock).mockRejectedValue(new Error('Server error'));
            const res = await request(app).put('/list-products').send({ list_id: '1', product_id: '2' });
            expect(res.status).toBe(500);
        });
    });

    describe('DELETE /:listId/:productId', () => {
        it('should delete product', async () => {
            (ShoppingListProductsService.prototype.deleteProduct as jest.Mock).mockResolvedValue(undefined);
            const res = await request(app).delete('/list-products/list1/prod1');
            expect(res.status).toBe(200);
        });

        it('should handle server error', async () => {
            (ShoppingListProductsService.prototype.deleteProduct as jest.Mock).mockRejectedValue(new Error('Server error'));
            const res = await request(app).delete('/list-products/list1/prod1');
            expect(res.status).toBe(500);
        });
    });
});
