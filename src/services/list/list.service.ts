import { httpService } from "../http.service";
import { List, ListBase } from "@/types";

export async function createList(list: ListBase): Promise<List | void> {
    try {
        const newList = await httpService.post('lists', list);
        return newList
    } catch (err) {
        console.error('Error fetching lists:', err);
    }
}
export async function updateList(list: List): Promise<List | void> {
    try {
        const newList = await httpService.put('lists' + `/${list._id}`, list);
        return newList
    } catch (err) {
        console.error('Error fetching lists:', err);
    }
}
export async function getLists(): Promise<List[]> {
    try {
        const lists = await httpService.get('lists');
        return lists
    } catch (err) {
        console.error('Error fetching lists:', err);
        return [];
    }
}
export async function getList(listId: string): Promise<List | null> {
    try {
        const list = await httpService.get('lists' + `/${listId}`);
        return list
    } catch (err) {
        console.error('Error fetching lists:', err);
        return null;
    }
}

export async function deleteList(id: string) {
    try {
        await httpService.delete('lists' + `/${id}`);

    } catch (err) {
        console.error('Error fetching lists:', err);
    }
}
export async function shareList(listId: string, email: string) {
    try {
        await httpService.put('lists' + `/${listId}/share`, { email });

    } catch (err) {
        console.error('Error fetching lists:', err);
    }
}

export async function linkList(listId: string) {
    try {
        await httpService.post('lists' + `/${listId}/join`);

    } catch (err) {
        console.error('Error fetching lists:', err);
    }
}
