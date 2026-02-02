import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @MinLength(3)
    name!: string;

    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @MinLength(6)
    password!: string;
}
