import { IsEnum } from "class-validator";

export class UpdatePurchaseOrderStatusDto {
    @IsEnum(["DRAFT", "ORDERED", "RECEIVED"])
    status!: "DRAFT" | "ORDERED" | "RECEIVED";
}
