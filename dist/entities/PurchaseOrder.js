"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseOrder = void 0;
const typeorm_1 = require("typeorm");
const PurchaseOrderItem_1 = require("./PurchaseOrderItem");
const Order_1 = require("./Order");
let PurchaseOrder = class PurchaseOrder {
};
exports.PurchaseOrder = PurchaseOrder;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Order_1.Order, { nullable: false }),
    __metadata("design:type", Order_1.Order)
], PurchaseOrder.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PurchaseOrderItem_1.PurchaseOrderItem, item => item.purchaseOrder, { cascade: true }),
    __metadata("design:type", Array)
], PurchaseOrder.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['DRAFT', 'ORDERED', 'RECEIVED'],
        default: 'DRAFT',
    }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PurchaseOrder.prototype, "createdAt", void 0);
exports.PurchaseOrder = PurchaseOrder = __decorate([
    (0, typeorm_1.Entity)('purchase_orders')
], PurchaseOrder);
