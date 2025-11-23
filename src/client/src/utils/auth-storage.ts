export class AuthStorage {
    private static TOKEN_KEY = 'token';
    private static USER_KEY = 'user';

    static setToken(token: string) {
        document.cookie = `${this.TOKEN_KEY}=${token}; path=/; max-age=86400; samesite=lax; secure=false`;
    }

    static getToken(): string | null {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === this.TOKEN_KEY) {
                return value;
            }
        }
        return null;
    }

    static async setUser(user: any) {
        document.cookie = `${this.USER_KEY}=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400; samesite=lax; secure=false`;
    }

    static async getUser(): Promise<any> {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === this.USER_KEY) {
                return JSON.parse(decodeURIComponent(value));
            }
        }
        return null;
    }

    static async clear() {
        document.cookie = `${this.TOKEN_KEY}=; path=/; max-age=0`;
        document.cookie = `${this.USER_KEY}=; path=/; max-age=0`;
    }
}