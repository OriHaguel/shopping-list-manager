import { httpService } from "../http.service";
import { Item, ItemBase, UpdateItemDto } from "@/types";

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
export async function updateItem(id: string, changedItem: UpdateItemDto): Promise<Item | void> {
    try {
        const item = await httpService.put('items' + `/${id}`, changedItem);
        return item
    } catch (err) {
        console.error('Error fetching lists:', err);
    }
}
export async function deleteItem(itemId: string) {
    try {
        await httpService.delete('items' + `/${itemId}`);
    } catch (err) {
        console.error('Error fetching lists:', err);
    }
}

// updateItem({
//     _id: '68fab5dce932f233b2518a40',
//     name: 'blyat',
//     category: 'wot',
//     checked: true,
//     price: 100,
// })

export function createEmptyItem(): ItemBase {
    return {
        listId: '',
        name: 'whatever',
        category: 'Other',
        checked: false,
        price: 0,
        unit: '',
        quantity: 1,
        description: '',
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