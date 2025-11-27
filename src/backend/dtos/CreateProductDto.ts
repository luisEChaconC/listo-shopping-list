import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    name!: string;
}