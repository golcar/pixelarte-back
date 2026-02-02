import { IsInt, IsString, IsEnum, Min } from "class-validator";
import { Size, Cut } from "../entities/PurchaseOrderItem";

export class CreatePurchaseOrderDto {
    @IsInt()
    productId!: number;

    @IsString()
    color!: string;

    @IsEnum(["XS", "S", "M", "L", "XL", "XXL", "3XL"])
    size!: Size;

    @IsEnum(["HOMBRE", "MUJER", "NIÑO", "JUVENIL"])
    cut!: Cut;

    @IsInt()
    @Min(1)
    quantity!: number;
}
