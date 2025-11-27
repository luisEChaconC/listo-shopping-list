import { Request, Response, NextFunction } from 'express';
import { validationMiddleware } from '../middleware/validation-middleware';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

jest.mock('class-validator');
jest.mock('class-transformer');

describe('validationMiddleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = { body: {} };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
    });

    it('should call next and transform body when validation passes', async () => {
        const dtoClass = class TestDto { };
        const middleware = validationMiddleware(dtoClass);
        const transformedDto = { name: 'test' };

        (plainToInstance as jest.Mock).mockReturnValue(transformedDto);
        (validate as jest.Mock).mockResolvedValue([]);

        await middleware(req as Request, res as Response, next);

        expect(req.body).toBe(transformedDto);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 400 with error message when validation fails', async () => {
        const dtoClass = class TestDto { static name = 'TestDto'; };
        const middleware = validationMiddleware(dtoClass);
        const error: ValidationError = {
            property: 'name',
            constraints: { isNotEmpty: 'Name should not be empty' },
        };

        (plainToInstance as jest.Mock).mockReturnValue({});
        (validate as jest.Mock).mockResolvedValue([error]);

        await middleware(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: '- Name is required' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should use display name from mapping', async () => {
        const dtoClass = class CreateUserDto { static name = 'CreateUserDto'; };
        const middleware = validationMiddleware(dtoClass);
        const error: ValidationError = {
            property: 'name',
            constraints: { isNotEmpty: 'Name should not be empty' },
        };

        (plainToInstance as jest.Mock).mockReturnValue({});
        (validate as jest.Mock).mockResolvedValue([error]);

        await middleware(req as Request, res as Response, next);

        expect(res.json).toHaveBeenCalledWith({ error: '- Full Name is required' });
    });

    it('should handle multiple errors', async () => {
        const dtoClass = class TestDto { static name = 'TestDto'; };
        const middleware = validationMiddleware(dtoClass);
        const errors: ValidationError[] = [
            {
                property: 'name',
                constraints: { isNotEmpty: 'Name should not be empty' },
            },
            {
                property: 'email',
                constraints: { isEmail: 'Email must be an email' },
            },
        ];

        (plainToInstance as jest.Mock).mockReturnValue({});
        (validate as jest.Mock).mockResolvedValue(errors);

        await middleware(req as Request, res as Response, next);

        expect(res.json).toHaveBeenCalledWith({ error: '- Name is required\n- Email must be a valid email address' });
    });
});