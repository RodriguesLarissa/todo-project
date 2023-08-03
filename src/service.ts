import { Database } from "./database";
import { ToDoItem, ToDoItemDAO } from "./model";

export class ServiceError extends Error {}

export class ToDoItemService {
    dao: ToDoItemDAO

    constructor(database: Database) {
        this.dao = new ToDoItemDAO(database);
    }

    async list(): Promise<ToDoItem[]> {
        return await this.dao.list();
    }

    async add(json: any): Promise<void> {
        try {
            const toDoItem = json as ToDoItem;
            await this.dao.insert(toDoItem);
        } catch (error) {
            console.log(error)
            throw new ServiceError("Failed to insert item");
        }
    }
}