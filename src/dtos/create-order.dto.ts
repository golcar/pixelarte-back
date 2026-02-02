import {
    IsArray,
    IsInt, IsNumber,
    IsOptional,
    ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
    @Type(() => Number)
    @IsInt()
    productId!: number;

    @Type(() => Number)
    @IsInt()
    quantity!: number;

    @Type(() => Number)
    @IsNumber()
    price!: number;

    @IsOptional()
    description?: string;
}

export class CreateOrderDto {
    @Type(() => Number)
    @IsNumber()
    clientId!: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items!: CreateOrderItemDto[];

    @IsOptional()
    note?: string;
}
