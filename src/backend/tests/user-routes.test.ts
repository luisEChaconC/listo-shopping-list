import request from 'supertest';
import express from 'express';
import userRoutes from '../routes/user-routes';

jest.mock('../services/user-service');
import { UserService } from '../services/user-service';

const app = express();
app.use(express.json());
app.use((req: any, _res, next) => { req.user = { id: '1', email: 'test@test.com' }; next(); });
app.use('/user', userRoutes);

describe('User Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /current', () => {
        it('should get current user', async () => {
            (UserService.prototype.getUserByEmail as jest.Mock).mockResolvedValue({ id: '1', name: 'Test', email: 'test@test.com' });
            const res = await request(app).get('/user/current');
            expect(res.status).toBe(200);
        });

        it('should handle user not found', async () => {
            (UserService.prototype.getUserByEmail as jest.Mock).mockRejectedValue(new Error('User not found'));
            const res = await request(app).get('/user/current');
            expect(res.status).toBe(404);
        });

        it('should handle server error', async () => {
            (UserService.prototype.getUserByEmail as jest.Mock).mockRejectedValue(new Error('Server error'));
            const res = await request(app).get('/user/current');
            expect(res.status).toBe(500);
        });
    });
});
