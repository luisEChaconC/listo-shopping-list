import { User, UserRepository } from "../domain/user";

export class MockUserRepository implements UserRepository {
    async create(user: Omit<User, "id">): Promise<User> {
        const newUser: User = {
            ...user,
            id: Math.random().toString(36).substring(2, 12),
        };
        return newUser;
    }
}
