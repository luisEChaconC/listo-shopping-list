import { SignupService } from '../services/signup-service';
import { User } from '../models/User';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
}));

const mockUserRepository = {
    findByEmail: jest.fn(),
    create: jest.fn(),
};

jest.mock('../repositories/user-repository', () => ({
    UserRepository: jest.fn().mockImplementation(() => mockUserRepository),
}));

describe('SignupService', () => {
    let signupService: SignupService;

    beforeEach(() => {
        jest.clearAllMocks();
        signupService = new SignupService();
    });

    it('should hash the password and create a user successfully', async () => {
        const userData = { name: 'John', email: 'john@example.com', password: 'password' };
        const hashedPassword = 'hashedpassword';
        const mockUser = { id: '1', name: 'John', email: 'john@example.com', password: hashedPassword };

        (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
        mockUserRepository.findByEmail.mockResolvedValue(null);
        mockUserRepository.create.mockResolvedValue(mockUser);

        const result = await signupService.register(userData);

        expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
        expect(mockUserRepository.create).toHaveBeenCalledWith({
            name: 'John',
            email: 'john@example.com',
            password: hashedPassword,
        });
        expect(result).toEqual(mockUser);
    });

    it('should throw an error if user creation fails', async () => {
        const userData = { name: 'John', email: 'john@example.com', password: 'password' };
        const error = new Error('Database error');

        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
        mockUserRepository.findByEmail.mockResolvedValue(null);
        mockUserRepository.create.mockRejectedValue(error);

        await expect(signupService.register(userData)).rejects.toThrow('Database error');
    });
});