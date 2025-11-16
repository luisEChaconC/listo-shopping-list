import { Request, Response } from "express";
import { DependencyContainer } from "../composition/dependency-container";
import { DEPENDENCIES } from "../composition/dependencies";

const container = new DependencyContainer();

export async function signupHandler(req: Request, res: Response) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const signupService = container.get(DEPENDENCIES.SignupService) as import("../application/signup-service").SignupService;
        const user = await signupService.register({ name, email, password });
        return res.status(201).json({ user });
    } catch (error) {
        if (error instanceof Error && error.message.includes('User already exists')) {
            return res.status(409).json({ error: 'User already exists' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
}
