import { IsNotEmpty, IsString } from 'class-validator'

export default class TokensRefreshDTO {
    @IsNotEmpty()
    @IsString()
    fingerprint: string

    @IsNotEmpty()
    @IsString()
    refreshToken: string
}
