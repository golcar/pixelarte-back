"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const data_source_1 = require("../config/data-source");
const Product_1 = require("../entities/Product");
class ProductService {
    constructor() {
        this.repo = data_source_1.AppDataSource.getRepository(Product_1.Product);
    }
    findAll() {
        return this.repo.find();
    }
    create(data) {
        return this.repo.save(this.repo.create(data));
    }
    async update(id, data) {
        const product = await this.repo.findOneBy({ id });
        if (!product) {
            throw new Error('Product not found');
        }
        // Evita sobrescribir campos críticos accidentalmente
        product.name = data.name ?? product.name;
        product.salePrice = data.salePrice ?? product.salePrice;
        product.purchasePrice = data.purchasePrice ?? product.purchasePrice;
        product.active = data.active ?? product.active;
        return this.repo.save(product);
    }
    async toggleActive(id, active) {
        const product = await this.repo.findOneBy({ id });
        if (!product) {
            throw new Error('Product not found');
        }
        product.active = active;
        return this.repo.save(product);
    }
}
exports.productService = new ProductService();
