"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const data_source_1 = require("./config/data-source");
const user_controller_1 = __importDefault(require("./controllers/user.controller"));
const auth_controller_1 = __importDefault(require("./controllers/auth.controller"));
const client_controller_1 = __importDefault(require("./controllers/client.controller"));
const product_controller_1 = __importDefault(require("./controllers/product.controller"));
const order_controller_1 = __importDefault(require("./controllers/order.controller"));
const purchase_order_item_controller_1 = __importDefault(require("./controllers/purchase-order-item.controller"));
const app = (0, express_1.default)();
/* =========================
   CORS — FORMA CORRECTA
========================= */
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:4200",
        "https://pixelarte-front.vercel.app"
    ],
    credentials: true
}));
/* =========================
   Middlewares
========================= */
app.use(express_1.default.json());
/* =========================
   Health
========================= */
app.get("/health", (_, res) => {
    res.json({ status: "UP" });
});
/* =========================
   Init DB + Routes
========================= */
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("✅ Base de datos conectada");
    app.use("/users", user_controller_1.default);
    app.use("/auth", auth_controller_1.default);
    app.use("/clients", client_controller_1.default);
    app.use("/products", product_controller_1.default);
    app.use("/orders", order_controller_1.default);
    app.use("/purchase-orders", purchase_order_item_controller_1.default);
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🔥 Server corriendo en puerto ${PORT}`);
    });
})
    .catch((error) => {
    console.error("❌ Error al iniciar la app", error);
});
