import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true, // ✅ OK por ahora
    logging: false,
    entities: ["dist/entities/*.js"],
});
