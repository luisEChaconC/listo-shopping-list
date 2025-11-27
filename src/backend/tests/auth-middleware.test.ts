import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware, AuthRequest } from '../middleware/auth-middleware';

jest.mock('jsonwebtoken');

describe('authMiddleware', () => {
    let req: Partial<AuthRequest>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = { headers: {} };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
        process.env.JWT_SECRET = 'secret';
    });

    it('should reject missing authorization header', () => {
        authMiddleware(req as AuthRequest, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should reject invalid token format', () => {
        req.headers = { authorization: 'InvalidToken' };
        authMiddleware(req as AuthRequest, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should reject invalid token', () => {
        req.headers = { authorization: 'Bearer token' };
        (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error(); });
        authMiddleware(req as AuthRequest, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should accept valid token', () => {
        req.headers = { authorization: 'Bearer token' };
        (jwt.verify as jest.Mock).mockReturnValue({ userId: '1' });
        authMiddleware(req as AuthRequest, res as Response, next);
        expect(next).toHaveBeenCalled();
    });
});
