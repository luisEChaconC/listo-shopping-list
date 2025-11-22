export class AuthStorage {
    private static TOKEN_KEY = 'token';
    private static USER_KEY = 'user';

    static setToken(token: string) {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    static getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    static setUser(user: any) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    static getUser(): any {
        const user = localStorage.getItem(this.USER_KEY);
        return user ? JSON.parse(user) : null;
    }

    static clear() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }
}