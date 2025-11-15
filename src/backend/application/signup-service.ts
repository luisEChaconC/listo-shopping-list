import { UserRepository, User } from "../domain/user";
import bcrypt from 'bcrypt';

export class SignupService {
    constructor(private userRepository: UserRepository) { }

    async register({ name, email, password }: { name: string; email: string; password: string }): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { name, email, password: hashedPassword };
        return this.userRepository.create(user);
    }
}
