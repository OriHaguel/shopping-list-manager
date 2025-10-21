import { useQuery } from "@tanstack/react-query";
import { httpService } from "../http.service";
import { List, ListBase } from "@/types";

export async function createList(list: ListBase) {
    try {
        await httpService.post('lists', list);

    } catch (err) {
        console.error('Error fetching lists:', err);
    }
}
export async function getLists(): Promise<List[]> {
    try {
        const response = await httpService.get('lists');

        return response
    } catch (err) {
        // console.error('Error fetching lists:', err);
        return [];
    }
}
