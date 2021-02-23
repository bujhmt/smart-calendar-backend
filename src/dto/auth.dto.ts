import { IsNotEmpty, MinLength, IsEmail } from 'class-validator'

export default class AuthDTO {
    @IsEmail()
    email: string

    @IsNotEmpty()
    @MinLength(6)
    password: string
}
