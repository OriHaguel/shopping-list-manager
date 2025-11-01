


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


export interface ListBase {
    name: string;
}
export interface List extends ListBase {
    _id: string;

}

export interface ItemBase {
    listId: string;
    name: string;
    category: string;
    checked: boolean;
    price: number;
    unit: string;
    quantity: number;
    description: string;
}
export interface Item extends ItemBase {
    _id: string;

}
export interface UpdateItemDto {
    _id?: string;
    name?: string;
    category?: string;
    checked?: boolean;
    price?: number;
    unit?: string;
    quantity?: number;
    description?: string;
}


export class AuthenticationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'AuthenticationError'
    }
}