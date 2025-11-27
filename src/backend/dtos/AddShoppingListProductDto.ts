import { IsOptional, IsNumber, IsString, Length, Min, IsNotEmpty } from 'class-validator';

export class AddShoppingListProductDto {
    @IsString()
    @IsNotEmpty()
    list_id!: string;

    @IsString()
    @IsNotEmpty()
    product_id!: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    quantity?: number;

    @IsOptional()
    @IsString()
    @Length(0, 50)
    unit?: string;
}