import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/auth-routes';

jest.mock('../services/auth-service');
import { AuthService } from '../services/auth-service';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /signup', () => {
        it('should create user', async () => {
            (AuthService.prototype.register as jest.Mock).mockResolvedValue({ id: '1', name: 'Test', email: 'test@test.com' });
            const res = await request(app).post('/auth/signup').send({ name: 'Test', email: 'test@test.com', password: 'pass' });
            expect(res.status).toBe(201);
        });

        it('should handle duplicate user', async () => {
            (AuthService.prototype.register as jest.Mock).mockRejectedValue(new Error('User already exists'));
            const res = await request(app).post('/auth/signup').send({ name: 'Test', email: 'test@test.com', password: 'pass' });
            expect(res.status).toBe(409);
        });

        it('should handle server error', async () => {
            (AuthService.prototype.register as jest.Mock).mockRejectedValue(new Error('Server error'));
            const res = await request(app).post('/auth/signup').send({ name: 'Test', email: 'test@test.com', password: 'pass' });
            expect(res.status).toBe(500);
        });
    });

    describe('POST /login', () => {
        it('should login user', async () => {
            (AuthService.prototype.login as jest.Mock).mockResolvedValue({ user: { id: '1', name: 'Test', email: 'test@test.com' }, token: 'token' });
            const res = await request(app).post('/auth/login').send({ email: 'test@test.com', password: 'pass' });
            expect(res.status).toBe(200);
        });

        it('should handle invalid credentials', async () => {
            (AuthService.prototype.login as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));
            const res = await request(app).post('/auth/login').send({ email: 'test@test.com', password: 'wrong' });
            expect(res.status).toBe(401);
        });

        it('should handle server error', async () => {
            (AuthService.prototype.login as jest.Mock).mockRejectedValue(new Error('Server error'));
            const res = await request(app).post('/auth/login').send({ email: 'test@test.com', password: 'pass' });
            expect(res.status).toBe(500);
        });
    });

    describe('POST /refresh', () => {
        it('should refresh token', async () => {
            (AuthService.prototype.refresh as jest.Mock).mockResolvedValue({ token: 'newtoken' });
            const res = await request(app).post('/auth/refresh').send({ token: 'oldtoken' });
            expect(res.status).toBe(200);
        });

        it('should handle invalid token', async () => {
            (AuthService.prototype.refresh as jest.Mock).mockRejectedValue(new Error('Invalid'));
            const res = await request(app).post('/auth/refresh').send({ token: 'bad' });
            expect(res.status).toBe(401);
        });
    });
});
