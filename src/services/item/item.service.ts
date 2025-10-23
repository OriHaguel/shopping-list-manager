import { httpService } from "../http.service";
import { Item, ItemBase } from "@/types";

export async function createItem(item: ItemBase): Promise<Item | void> {
    try {
        const newItem = await httpService.post('items', item);
        return newItem
    } catch (err) {
        console.error('Error fetching lists:', err);
    }
}
export async function getItems(listId: string): Promise<Item[] | void> {
    try {
        const items = await httpService.get('items/all' + `/${listId}`);
        return items
    } catch (err) {
        console.error('Error fetching lists:', err);
    }
}
export function createEmptyItem(): ItemBase {
    return {
        listId: '',
        name: 'whatever',
        category: 'none',
        checked: false,
        price: 0,
    };
}

// export async function getLists(): Promise<List[]> {
//     try {
//         const response = await httpService.get('lists');
//         console.log('yo')
//         return response
//     } catch (err) {
//         // console.error('Error fetching lists:', err);
//         return [];
//     }
// }

// export async function deleteList(id: string) {
//     try {
//         const newList = await httpService.delete('lists' + `/${id}`);
//         return newList
//     } catch (err) {
//         console.error('Error fetching lists:', err);
//     }
// }