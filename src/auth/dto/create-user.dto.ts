import { IsEmail, IsString, MinLength } from "class-validator";

//tras instalar class-validator
//senon luce/ven como/con x non o acepta, podemos ir probando por postman, para que esto funcione ver main.ts
//as que tenhen o decorador son as que entran no whitelist: true
export class CreateUserDto {
    
    @IsEmail()
    email:string;

    @IsString()
    name:string;

   @MinLength(6)
    password: string;
}