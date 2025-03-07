export interface AuthUserData {
    email: string;
    accessLevel: string;
    jwtToken: string;
}

export interface AuthResponse {
    message: string;
    ok: boolean;
    data: AuthUserData;
}