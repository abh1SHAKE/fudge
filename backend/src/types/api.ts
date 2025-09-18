export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    errors?: string[];
}

export interface AuthResponse {
    user: {
        id: string;
        username: string;
        email: string;
        role: string;
    };

    token: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}