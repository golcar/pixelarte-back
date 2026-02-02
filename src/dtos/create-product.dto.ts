import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    name!: string;

    @IsNumber()
    purchasePrice!: number;

    @IsNumber()
    salePrice!: number;
}
