import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateShoppingListDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    name!: string;
}