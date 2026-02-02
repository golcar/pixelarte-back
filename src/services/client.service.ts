import { AppDataSource } from "../config/data-source";
import { Client } from "../entities/Client";

class ClientService {
    private repo = AppDataSource.getRepository(Client);

    findAll() {
        return this.repo.find();
    }

    create(data: Partial<Client>) {
        const client = this.repo.create(data);
        return this.repo.save(client);
    }
}

export const clientService = new ClientService();
