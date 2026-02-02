import { AppDataSource } from "../config/data-source";
import { Product } from "../entities/Product";

class ProductService {
    private repo = AppDataSource.getRepository(Product);

    findAll() {
        return this.repo.find();
    }

    create(data: Partial<Product>) {
        return this.repo.save(this.repo.create(data));
    }
    async update(id: number, data: Partial<Product>) {
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

    async toggleActive(id: number, active: boolean) {
        const product = await this.repo.findOneBy({ id });
        if (!product) {
            throw new Error('Product not found');
        }

        product.active = active;
        return this.repo.save(product);
    }

}

export const productService = new ProductService();
