export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

export interface UserRepository {
    create(user: Omit<User, "id">): Promise<User>;
}
