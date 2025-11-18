import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user-repository";
import { User } from "../models/User";

export class SignupService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async register({ name, email, password }: { name: string; email: string; password: string }): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { name, email, password: hashedPassword };
        return this.userRepository.create(user);
    }
}