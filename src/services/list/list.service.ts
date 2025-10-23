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
export async function getLists(): Promise<List[]> {
    try {
        const response = await httpService.get('lists');
        console.log('yo')
        return response
    } catch (err) {
        // console.error('Error fetching lists:', err);
        return [];
    }
}

export async function deleteList(id: string) {
    try {
        const newList = await httpService.delete('lists' + `/${id}`);
        return newList
    } catch (err) {
        console.error('Error fetching lists:', err);
    }
}