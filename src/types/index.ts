


export interface User {
    id: string;
    email: string;
    password: string
}
export interface List {
    id: string;
    name: string;
    userId: string
}

export interface Item {
    id: string;
    listId: string;
    name: string;
    category: string;
    checked: boolean;
    unit?: string;
    price?: number;
    quantity?: number;
    notes?: string;
}