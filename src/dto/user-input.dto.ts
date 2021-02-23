import { MinLength, IsEmail, IsString } from 'class-validator'

export default class UserInputDto {
    @IsEmail()
    email?: string

    @IsString()
    @MinLength(6)
    password?: string

    @IsString()
    avaUrl?: string

    @IsString()
    fullname?: string

    @IsString()
    telegramId?: string
}
