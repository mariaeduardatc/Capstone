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

export interface ImageData {
    id: string;
    alt_description: string;
    urls: {
        raw: string;
        full: string;
        regular: string;
        small: string;
        thumb: string;
    };
}

export interface ApiResponseImg {
    ok: boolean;
    status: number;
    body: {
        results: ImageData[];
        
    };
}

export interface APIResponseDB {
    ok: boolean;
    status: number;
    body: SavedItineraries[];
}

export interface SavedItineraries{
    id: string;
    user_id: string;
    saved_itinerary: object;
    number_of_days: string;
    image_url: string;
    city_name: string;
}
