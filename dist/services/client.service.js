"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientService = void 0;
const data_source_1 = require("../config/data-source");
const Client_1 = require("../entities/Client");
class ClientService {
    constructor() {
        this.repo = data_source_1.AppDataSource.getRepository(Client_1.Client);
    }
    findAll() {
        return this.repo.find();
    }
    create(data) {
        const client = this.repo.create(data);
        return this.repo.save(client);
    }
}
exports.clientService = new ClientService();
