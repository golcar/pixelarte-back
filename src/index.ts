import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/data-source";

import userController from "./controllers/user.controller";
import authController from "./controllers/auth.controller";
import clientController from "./controllers/client.controller";
import productController from "./controllers/product.controller";
import orderController from "./controllers/order.controller";
import purchaseOrderController from "./controllers/purchase-order-item.controller";

const app = express();

/* =========================
   CORS — FORMA CORRECTA
========================= */
app.use(
    cors({
        origin: [
            "http://localhost:4200",
            "https://pixelarte-front.vercel.app",
        ],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

/* =========================
   Middlewares
========================= */
app.use(express.json());

/* =========================
   Health
========================= */
app.get("/health", (_, res) => {
    res.json({ status: "UP" });
});

/* =========================
   Init DB + Routes
========================= */
AppDataSource.initialize()
    .then(() => {
        console.log("✅ Base de datos conectada");

        app.use("/users", userController);
        app.use("/auth", authController);
        app.use("/clients", clientController);
        app.use("/products", productController);
        app.use("/orders", orderController);
        app.use("/purchase-orders", purchaseOrderController);

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🔥 Server corriendo en puerto ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("❌ Error al iniciar la app", error);
    });
