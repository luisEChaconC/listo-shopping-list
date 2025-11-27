import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';

function getDisplayName(dtoClass: new () => object, property: string): string {
    const mappings: Record<string, Record<string, string>> = {
        'CreateUserDto': {
            'name': 'Full Name',
            'email': 'Email',
            'password': 'Password',
        },
        'LoginDto': {
            'email': 'Email',
            'password': 'Password',
        },
        'CreateProductDto': {
            'name': 'Product Name',
        },
        'CreateShoppingListDto': {
            'name': 'Shopping List Name',
        },
        'AddShoppingListProductDto': {
            'list_id': 'Shopping List',
            'product_id': 'Product',
            'price': 'Price',
            'quantity': 'Quantity',
            'unit': 'Unit',
        },
        'UpdateShoppingListProductDto': {
            'price': 'Price',
            'quantity': 'Quantity',
            'unit': 'Unit',
        },
    };
    return mappings[dtoClass.name]?.[property] || property.charAt(0).toUpperCase() + property.slice(1);
}

export function validationMiddleware(dtoClass: new () => object) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dto = plainToInstance(dtoClass, req.body);
        const errors = await validate(dto);

        if (errors.length > 0) {
            const errorMessages = errors.map(err => {
                const field = getDisplayName(dtoClass, err.property);
                const constraints = err.constraints || {};
                const messages = Object.keys(constraints).map(key => {
                    switch (key) {
                        case 'isNotEmpty':
                            return `${field} is required`;
                        case 'isEmail':
                            return `${field} must be a valid email address`;
                        case 'length':
                            return constraints[key];
                        case 'matches':
                            return constraints[key];
                        default:
                            return constraints[key];
                    }
                });
                return `- ${messages.join(', ')}`;
            });
            return res.status(400).json({ error: errorMessages.join('\n') });
        }

        req.body = dto;
        next();
    };
}