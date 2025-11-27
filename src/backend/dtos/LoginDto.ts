import { IsEmail, IsNotEmpty, Length, IsString, Matches } from 'class-validator';

export class LoginDto {
    @IsEmail()
    @Length(1, 255)
    email!: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    })
    password!: string;
}