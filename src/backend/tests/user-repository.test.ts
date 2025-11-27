import { UserRepository } from '../repositories/user-repository';
import { User } from '../models/User';

const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
};

jest.mock('../config/database', () => ({
    AppDataSource: {
        getRepository: jest.fn(() => mockRepository),
    },
}));

describe('UserRepository', () => {
    let userRepository: UserRepository;

    beforeEach(() => {
        jest.clearAllMocks();
        userRepository = new UserRepository();
    });

    describe('create', () => {
        it('should create a new user', async () => {
            mockRepository.findOne.mockResolvedValue(null);
            mockRepository.create.mockReturnValue({ email: 'test@test.com' });
            mockRepository.save.mockResolvedValue({ id: '1', email: 'test@test.com' });

            const result = await userRepository.create({ email: 'test@test.com', name: 'Test', password: 'pass' } as User);
            expect(result.id).toBe('1');
        });

        it('should throw if user exists', async () => {
            mockRepository.findOne.mockResolvedValue({ id: '1' });
            await expect(userRepository.create({ email: 'test@test.com' } as User)).rejects.toThrow('User already exists');
        });
    });

    describe('findByEmail', () => {
        it('should find user by email', async () => {
            mockRepository.findOne.mockResolvedValue({ id: '1', email: 'test@test.com' });
            const result = await userRepository.findByEmail('test@test.com');
            expect(result?.email).toBe('test@test.com');
        });
    });
});
