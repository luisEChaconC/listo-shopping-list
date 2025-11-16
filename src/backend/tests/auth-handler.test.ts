// Mock the dependency container
const mockGet = jest.fn();
jest.mock('../composition/dependency-container', () => ({
    DependencyContainer: jest.fn().mockImplementation(() => ({
        get: mockGet,
    })),
}));

jest.mock('../composition/dependencies', () => ({
    DEPENDENCIES: {
        SignupService: Symbol.for('SignupService'),
    },
}));

import { Request, Response } from 'express';
import { signupHandler } from '../presentation/auth-handler';
import { SignupService } from '../application/signup-service';

describe('signupHandler', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockSignupService: Partial<SignupService>;

    beforeEach(() => {
        mockReq = {
            body: {},
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockSignupService = {
            register: jest.fn(),
        };
        mockGet.mockReturnValue(mockSignupService);
    });

    it('should return 400 if required fields are missing', async () => {
        mockReq.body = { name: 'John', email: 'john@example.com' }; // missing password

        await signupHandler(mockReq as Request, mockRes as Response);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
    });

    it('should return 201 and user on successful registration', async () => {
        mockReq.body = { name: 'John', email: 'john@example.com', password: 'password' };
        const mockUser = { id: '1', name: 'John', email: 'john@example.com', password: 'hashed' };
        (mockSignupService.register as jest.Mock).mockResolvedValue(mockUser);

        await signupHandler(mockReq as Request, mockRes as Response);

        expect(mockSignupService.register).toHaveBeenCalledWith({ name: 'John', email: 'john@example.com', password: 'password' });
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({ user: mockUser });
    });

    it('should return 409 if user already exists', async () => {
        mockReq.body = { name: 'John', email: 'john@example.com', password: 'password' };
        const error = new Error('User already exists');
        (mockSignupService.register as jest.Mock).mockRejectedValue(error);

        await signupHandler(mockReq as Request, mockRes as Response);

        expect(mockRes.status).toHaveBeenCalledWith(409);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'User already exists' });
    });

    it('should return 500 on other errors', async () => {
        mockReq.body = { name: 'John', email: 'john@example.com', password: 'password' };
        const error = new Error('Database error');
        (mockSignupService.register as jest.Mock).mockRejectedValue(error);

        await signupHandler(mockReq as Request, mockRes as Response);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});