import { Repository } from 'typeorm';
import { UserDTO } from '../application/dto/UserDTO';
import { User, UserRepository } from "../domain/user";
import { AppDataSource } from './typeorm.config';

export class PostgreSQLUserRepository implements UserRepository {
    private userRepository: Repository<UserDTO>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(UserDTO);
    }

    async create(user: Omit<User, "id">): Promise<User> {
        const existing = await this.userRepository.findOne({ where: { email: user.email } });
        if (existing) {
            throw new Error('User already exists');
        }
        const newUser = this.userRepository.create(user);
        const savedUser = await this.userRepository.save(newUser);
        return {
            id: savedUser.id,
            name: savedUser.name,
            email: savedUser.email,
            password: savedUser.password,
        };
    }
}