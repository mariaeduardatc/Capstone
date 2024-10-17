export interface ApiResponse {
    ok: boolean;
    status: number;
    body: {
        data?: object;
        error?: {
            message: string;
            status: number;
        };
    };
}

export interface State {
    [key: string]: {
        title: string;
        places: { id: number; name: string; description: string }[];
    };
}

export interface Errors {
    message?: string;
    status?: number;
    details?: object;
}
