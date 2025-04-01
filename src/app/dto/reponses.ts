export interface AuthUserData {
    email: string;
    accessLevel: string;
    jwtToken: string;
    isFirstLogin: boolean;
}

export interface AuthResponse {
    message: string;
    ok: boolean;
    data: AuthUserData;
}

export interface ChangePasswordRequest {  
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ApiResponse<T> {
    ok: boolean;
    message: string;
    data: T;
}