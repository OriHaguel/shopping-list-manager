


// Base with common fields
interface UserBase {
    email: string;
}

// When a user exists in DB
export interface User extends UserBase {
    _id: string;
    password: string;
}

// Safe version without password
export type SavedUser = Omit<User, 'password'>;

// Signup/Login payload (no _id yet)
export interface UserSignupLogin extends UserBase {
    password: string;
}

export interface List {
    _id: string;
    name: string;
    userId: string
}

export interface Item {
    _id: string;
    listId: string;
    name: string;
    category: string;
    checked: boolean;
    unit?: string;
    price?: number;
    quantity?: number;
    notes?: string;
}


export class AuthenticationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'AuthenticationError'
    }
}