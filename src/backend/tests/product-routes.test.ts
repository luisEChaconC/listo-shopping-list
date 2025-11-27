import request from 'supertest';
import express from 'express';
import productRoutes from '../routes/product-routes';
import { AuthRequest } from '../middleware/auth-middleware';

jest.mock('../services/product-service');
import { ProductService } from '../services/product-service';

const app = express();
app.use(express.json());
app.use((req, _res, next) => { (req as AuthRequest).user = { id: '1', email: 'test@test.com', name: 'Test' }; next(); });
app.use('/products', productRoutes);

describe('Product Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /', () => {
        it('should create product', async () => {
            (ProductService.prototype.createProduct as jest.Mock).mockResolvedValue({ id: '1', name: 'Apple' });
            const res = await request(app).post('/products').send({ name: 'Apple' });
            expect(res.status).toBe(201);
        });

        it('should handle duplicate product', async () => {
            (ProductService.prototype.createProduct as jest.Mock).mockRejectedValue(new Error('Product already exists'));
            const res = await request(app).post('/products').send({ name: 'Apple' });
            expect(res.status).toBe(409);
        });

        it('should handle validation error', async () => {
            (ProductService.prototype.createProduct as jest.Mock).mockRejectedValue(new Error('Product name is required'));
            const res = await request(app).post('/products').send({ name: 'Apple' });
            expect(res.status).toBe(400);
        });

        it('should handle server error', async () => {
            (ProductService.prototype.createProduct as jest.Mock).mockRejectedValue(new Error('Server error'));
            const res = await request(app).post('/products').send({ name: 'Apple' });
            expect(res.status).toBe(500);
        });
    });

    describe('GET /', () => {
        it('should get products', async () => {
            (ProductService.prototype.getUserProducts as jest.Mock).mockResolvedValue([{ id: '1', name: 'Apple' }]);
            const res = await request(app).get('/products');
            expect(res.status).toBe(200);
        });

        it('should handle server error', async () => {
            (ProductService.prototype.getUserProducts as jest.Mock).mockRejectedValue(new Error('Server error'));
            const res = await request(app).get('/products');
            expect(res.status).toBe(500);
        });
    });

    describe('DELETE /:id', () => {
        it('should delete product', async () => {
            (ProductService.prototype.deleteUserProduct as jest.Mock).mockResolvedValue(undefined);
            const res = await request(app).delete('/products/1');
            expect(res.status).toBe(200);
        });

        it('should handle not found', async () => {
            (ProductService.prototype.deleteUserProduct as jest.Mock).mockRejectedValue(new Error('Product not found'));
            const res = await request(app).delete('/products/1');
            expect(res.status).toBe(404);
        });

        it('should handle predefined product', async () => {
            (ProductService.prototype.deleteUserProduct as jest.Mock).mockRejectedValue(new Error('Cannot delete predefined products'));
            const res = await request(app).delete('/products/1');
            expect(res.status).toBe(403);
        });

        it('should handle not owned', async () => {
            (ProductService.prototype.deleteUserProduct as jest.Mock).mockRejectedValue(new Error('Product is not owned by the user'));
            const res = await request(app).delete('/products/1');
            expect(res.status).toBe(403);
        });

        it('should handle server error', async () => {
            (ProductService.prototype.deleteUserProduct as jest.Mock).mockRejectedValue(new Error('Server error'));
            const res = await request(app).delete('/products/1');
            expect(res.status).toBe(500);
        });
    });
});
