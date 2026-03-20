import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreatePaymentDto {
    @Type(() => Number)
    @IsNumber()
    @Min(0.01)
    amount!: number;

    @IsOptional()
    @IsString()
    @IsIn(["CASH", "TRANSFER", "CARD", "DEPOSIT"])
    paymentMethod?: "CASH" | "TRANSFER" | "CARD" | "DEPOSIT";

    @IsOptional()
    @IsString()
    reference?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}