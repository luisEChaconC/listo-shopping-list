
import { RegisterUserPayload } from "./types";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export async function signup(payload: RegisterUserPayload): Promise<{ success: boolean; error?: string }> {
    try {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        if (res.ok) {
            return { success: true };
        } else {
            const data = await res.json();
            return { success: false, error: data.error || "Registration failed" };
        }
    } catch {
        return { success: false, error: "Registration failed" };
    }
}
