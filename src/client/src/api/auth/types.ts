export interface RegisterUserPayload {
    name: string;
    email: string;
    password: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface JwtPayload {
    id: string;
    email: string;
    name: string;
    exp: number;
}
