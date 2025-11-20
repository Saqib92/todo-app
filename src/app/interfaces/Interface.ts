export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: 'male' | 'female' | 'other';
    image: string;
    token: string; // mutable (tokens may refresh)
}

export interface Todo {
    id: number;
    todo: string;
    completed: boolean;
    userId: number;
    isDeleted?: boolean; // Optimistic UI flag
}
